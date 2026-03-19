import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ServiceBooking,
  ServiceBookingDocument,
} from '../../schemas/service-booking.schema';
import { CreateServiceBookingDto } from './dto/create-service-booking.dto';
import { UpdateServiceBookingDto } from './dto/create-service-booking.dto';

@Injectable()
export class ServiceBookingsService {
  constructor(
    @InjectModel(ServiceBooking.name)
    private serviceBookingModel: Model<ServiceBookingDocument>,
  ) {}

  async create(
    createServiceBookingDto: CreateServiceBookingDto,
  ): Promise<ServiceBookingDocument> {
    const booking = new this.serviceBookingModel({
      ...createServiceBookingDto,
      listing_id: new Types.ObjectId(createServiceBookingDto.listing_id),
      customer_id: new Types.ObjectId(createServiceBookingDto.customer_id),
      worker_id: new Types.ObjectId(createServiceBookingDto.worker_id),
      employer_id: createServiceBookingDto.employer_id
        ? new Types.ObjectId(createServiceBookingDto.employer_id)
        : undefined,
    });
    return booking.save();
  }

  async findAll(): Promise<ServiceBookingDocument[]> {
    return this.serviceBookingModel
      .find()
      .populate('listing_id')
      .populate('customer_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();
  }

  async findOne(id: string): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel
      .findById(id)
      .populate('listing_id')
      .populate('customer_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();
    if (!booking) {
      throw new NotFoundException('Service booking not found');
    }
    return booking;
  }

  async findByCustomer(customerId: string): Promise<ServiceBookingDocument[]> {
    return this.serviceBookingModel
      .find({ customer_id: new Types.ObjectId(customerId) })
      .populate('listing_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();
  }

  async findByWorker(workerId: string): Promise<ServiceBookingDocument[]> {
    return this.serviceBookingModel
      .find({ worker_id: new Types.ObjectId(workerId) })
      .populate('listing_id')
      .populate('customer_id')
      .populate('employer_id')
      .exec();
  }

  async update(
    id: string,
    updateServiceBookingDto: UpdateServiceBookingDto,
  ): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel
      .findByIdAndUpdate(id, updateServiceBookingDto, { new: true })
      .populate('listing_id')
      .populate('customer_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();
    if (!booking) {
      throw new NotFoundException('Service booking not found');
    }
    return booking;
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceBookingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Service booking not found');
    }
  }
}
