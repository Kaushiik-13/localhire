import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ServiceProvider,
  ServiceProviderDocument,
} from '../../schemas/service-provider.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateServiceProviderInputDto } from './dto/inputs/service-provider.input.dto';
import { UpdateServiceProviderInputDto } from './dto/inputs/service-provider.input.dto';
import { Role } from '../../common/enums/roles.enum';
import { UserStatus } from '../../common/enums/status.enum';

@Injectable()
export class ServiceProvidersService {
  constructor(
    @InjectModel(ServiceProvider.name)
    private serviceProviderModel: Model<ServiceProviderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createServiceProviderDto: CreateServiceProviderInputDto,
    userId: string,
  ): Promise<ServiceProviderDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.roles.includes(Role.SERVICE_PROVIDER)) {
      user.roles.push(Role.SERVICE_PROVIDER);
      await user.save();
    }

    const existingProvider = await this.serviceProviderModel.findOne({
      user_id: userId,
    });
    if (existingProvider) {
      throw new ConflictException(
        'Service provider profile already exists for this user',
      );
    }

    const serviceProvider = new this.serviceProviderModel({
      ...createServiceProviderDto,
      user_id: new Types.ObjectId(userId),
      skills:
        createServiceProviderDto.skills?.map((s) => new Types.ObjectId(s)) ||
        [],
      available_from: createServiceProviderDto.available_from
        ? new Date(createServiceProviderDto.available_from)
        : undefined,
    });
    return serviceProvider.save();
  }

  async findAll(): Promise<ServiceProviderDocument[]> {
    return this.serviceProviderModel
      .find()
      .populate('user_id')
      .populate('skills')
      .exec();
  }

  async findOne(id: string): Promise<ServiceProviderDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid ID');
    }
    const serviceProvider = await this.serviceProviderModel
      .findById(id)
      .populate('user_id')
      .populate('skills')
      .exec();
    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }
    return serviceProvider;
  }

  async findByUserId(userId: string): Promise<ServiceProviderDocument | null> {
    return this.serviceProviderModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .populate('skills')
      .exec();
  }

  async update(
    id: string,
    updateServiceProviderDto: UpdateServiceProviderInputDto,
  ): Promise<ServiceProviderDocument> {
    const updateData: Record<string, unknown> = { ...updateServiceProviderDto };
    if (updateServiceProviderDto.available_from) {
      updateData['available_from'] = new Date(
        updateServiceProviderDto.available_from,
      );
    }
    if (updateServiceProviderDto.skills) {
      updateData['skills'] = updateServiceProviderDto.skills.map(
        (s) => new Types.ObjectId(s),
      );
    }

    const serviceProvider = await this.serviceProviderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('user_id')
      .populate('skills')
      .exec();
    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }
    return serviceProvider;
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceProviderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Service provider not found');
    }
  }

  async updateRating(
    serviceProviderId: string,
    rating: number,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider =
      await this.serviceProviderModel.findById(serviceProviderId);
    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }
    serviceProvider.rating = rating;
    return serviceProvider.save();
  }

  async incrementCompletedServices(
    serviceProviderId: string,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider = await this.serviceProviderModel.findByIdAndUpdate(
      serviceProviderId,
      { $inc: { completed_services: 1 } },
      { new: true },
    );
    if (!serviceProvider) {
      throw new NotFoundException('Service provider not found');
    }
    return serviceProvider;
  }

  async getOwnProfile(userId: string): Promise<ServiceProviderDocument> {
    const serviceProvider = await this.serviceProviderModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .populate('skills')
      .exec();
    if (!serviceProvider) {
      throw new NotFoundException('Service provider profile not found');
    }
    return serviceProvider;
  }

  async toggleStatus(userId: string): Promise<ServiceProviderDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status =
      user.status === UserStatus.ACTIVE
        ? UserStatus.DEACTIVE
        : UserStatus.ACTIVE;
    await user.save();
    return this.getOwnProfile(userId);
  }

  async updateOwnProfile(
    userId: string,
    dto: UpdateServiceProviderInputDto,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider = await this.serviceProviderModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!serviceProvider) {
      throw new NotFoundException('Service provider profile not found');
    }

    const updateData: Record<string, unknown> = { ...dto };
    if (dto.available_from) {
      updateData['available_from'] = new Date(dto.available_from);
    }
    if (dto.skills) {
      updateData['skills'] = dto.skills.map((s) => new Types.ObjectId(s));
    }

    const updated = await this.serviceProviderModel
      .findByIdAndUpdate(serviceProvider._id, updateData, { new: true })
      .populate('user_id')
      .populate('skills')
      .exec();
    if (!updated) {
      throw new NotFoundException('Service provider not found');
    }
    return updated;
  }

  async deleteOwnProfile(userId: string): Promise<{ message: string }> {
    const serviceProvider = await this.serviceProviderModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!serviceProvider) {
      throw new NotFoundException('Service provider profile not found');
    }

    await this.serviceProviderModel.findByIdAndDelete(serviceProvider._id);
    await this.userModel.findByIdAndDelete(userId);

    return { message: 'Service provider account deleted successfully' };
  }

  async search(params: {
    skill?: string;
    location?: string;
    minRating?: number;
    maxHourlyRate?: number;
    availability?: string;
    page: number;
    limit: number;
  }): Promise<{ count: number; results: ServiceProviderDocument[] }> {
    const filter: Record<string, any> = {};

    if (params.skill) {
      if (Types.ObjectId.isValid(params.skill)) {
        filter['skills'] = { $in: [new Types.ObjectId(params.skill)] };
      } else {
        const skillDoc = await this.serviceProviderModel.db
          .collection('skills')
          .findOne({ skill_name: { $regex: params.skill, $options: 'i' } });
        if (skillDoc) {
          filter['skills'] = { $in: [skillDoc._id] };
        }
      }
    }

    if (params.location) {
      filter['current_location'] = {
        $regex: params.location,
        $options: 'i',
      };
    }

    if (params.minRating !== undefined) {
      filter['rating'] = { $gte: params.minRating };
    }

    if (params.maxHourlyRate !== undefined) {
      filter['hourly_rate'] = { $lte: params.maxHourlyRate };
    }

    if (params.availability) {
      filter['availability'] = params.availability;
    }

    const skip = (params.page - 1) * params.limit;

    const [results, count] = await Promise.all([
      this.serviceProviderModel
        .find(filter)
        .populate('user_id')
        .populate('skills')
        .skip(skip)
        .limit(params.limit)
        .exec(),
      this.serviceProviderModel.countDocuments(filter).exec(),
    ]);

    return { count, results };
  }
}
