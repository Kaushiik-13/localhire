import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employer, EmployerDocument } from '../../schemas/employer.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateEmployerInputDto } from './dto/inputs/employer.input.dto';
import {
  UpdateEmployerInputDto,
  UpdateEmployerProfileInputDto,
} from './dto/inputs/employer.input.dto';
import { Role } from '../../common/enums/roles.enum';
import { UserStatus } from '../../common/enums/status.enum';

@Injectable()
export class EmployersService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createEmployerDto: CreateEmployerInputDto,
    userId: string,
  ): Promise<EmployerDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.roles.includes(Role.EMPLOYER)) {
      throw new BadRequestException('User does not have employer role');
    }

    const existingEmployer = await this.employerModel.findOne({
      user_id: userId,
    });
    if (existingEmployer) {
      throw new ConflictException(
        'Employer profile already exists for this user',
      );
    }

    const employer = new this.employerModel({
      ...createEmployerDto,
      user_id: new Types.ObjectId(userId),
    });
    return employer.save();
  }

  async findAll(): Promise<EmployerDocument[]> {
    return this.employerModel.find().populate('user_id').exec();
  }

  async findOne(id: string): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findById(id)
      .populate('user_id')
      .exec();
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    return employer;
  }

  async findByUserId(userId: string): Promise<EmployerDocument | null> {
    return this.employerModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .exec();
  }

  async update(
    id: string,
    updateEmployerDto: UpdateEmployerInputDto,
  ): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findByIdAndUpdate(id, updateEmployerDto, { new: true })
      .populate('user_id')
      .exec();
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    return employer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.employerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Employer not found');
    }
  }

  async getOwnProfile(userId: string): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .exec();
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }
    return employer;
  }

  async toggleStatus(userId: string): Promise<EmployerDocument> {
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
    dto: UpdateEmployerProfileInputDto,
  ): Promise<EmployerDocument> {
    const employer = await this.employerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    const employerUpdateData: Record<string, unknown> = { ...dto };
    delete employerUpdateData.user;

    await this.employerModel.findByIdAndUpdate(employer._id, employerUpdateData);

    if (dto.user) {
      const userUpdateData: Record<string, unknown> = { ...dto.user };
      if (dto.user.address) {
        delete userUpdateData.address;
        const user = await this.userModel.findById(userId);
        const existingAddresses = user?.addresses || [];
        if (existingAddresses.length > 0) {
          const existingAddress = existingAddresses[0];
          userUpdateData['addresses'] = [
            {
              address_line1:
                dto.user.address.address_line1 ??
                existingAddress.address_line1,
              address_line2:
                dto.user.address.address_line2 ??
                existingAddress.address_line2,
              city: dto.user.address.city ?? existingAddress.city,
              state: dto.user.address.state ?? existingAddress.state,
              postal_code:
                dto.user.address.postal_code ?? existingAddress.postal_code,
              country: dto.user.address.country ?? existingAddress.country,
              address_type: existingAddress.address_type,
              latitude: existingAddress.latitude,
              longitude: existingAddress.longitude,
            },
          ];
        } else {
          userUpdateData['$push'] = { addresses: dto.user.address };
        }
      }
      await this.userModel.findByIdAndUpdate(userId, userUpdateData);
    }

    return this.getOwnProfile(userId);
  }

  async deleteOwnProfile(userId: string): Promise<{ message: string }> {
    const employer = await this.employerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!employer) {
      throw new NotFoundException('Employer profile not found');
    }

    await this.employerModel.findByIdAndDelete(employer._id);
    await this.userModel.findByIdAndDelete(userId);

    return { message: 'Employer profile and user account deleted successfully' };
  }
}
