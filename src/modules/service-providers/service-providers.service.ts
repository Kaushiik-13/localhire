import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ServiceProvider,
  ServiceProviderDocument,
} from '../../schemas/service-provider.schema';
import { CreateServiceProviderDto } from './dto/create-service-provider.dto';
import { UpdateServiceProviderDto } from './dto/create-service-provider.dto';

@Injectable()
export class ServiceProvidersService {
  constructor(
    @InjectModel(ServiceProvider.name)
    private serviceProviderModel: Model<ServiceProviderDocument>,
  ) {}

  async create(
    createServiceProviderDto: CreateServiceProviderDto,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider = new this.serviceProviderModel({
      ...createServiceProviderDto,
      user_id: new Types.ObjectId(createServiceProviderDto.user_id),
      skills:
        createServiceProviderDto.skills?.map((s) => new Types.ObjectId(s)) ||
        [],
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
    updateServiceProviderDto: UpdateServiceProviderDto,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider = await this.serviceProviderModel
      .findByIdAndUpdate(id, updateServiceProviderDto, { new: true })
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
}
