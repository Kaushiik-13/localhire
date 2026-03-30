import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ServiceBooking,
  ServiceBookingDocument,
} from '../../schemas/service-booking.schema';
import { Listing, ListingDocument } from '../../schemas/listing.schema';
import {
  CreateServiceBookingDto,
  UpdateServiceBookingStatusDto,
} from './dto/create-service-booking.dto';
import { BookingStatus } from '../../common/enums/status.enum';
import { ApprovalStatus } from '../../common/enums/approval.enum';
import { ListingStatus } from '../../common/enums/status.enum';

@Injectable()
export class ServiceBookingsService {
  constructor(
    @InjectModel(ServiceBooking.name)
    private serviceBookingModel: Model<ServiceBookingDocument>,
    @InjectModel(Listing.name)
    private listingModel: Model<ListingDocument>,
  ) {}

  async create(
    createServiceBookingDto: CreateServiceBookingDto,
  ): Promise<ServiceBookingDocument> {
    const listing = await this.listingModel.findById(
      createServiceBookingDto.listing_id,
    );
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const booking = new this.serviceBookingModel({
      listing_id: new Types.ObjectId(createServiceBookingDto.listing_id),
      service_provider_id: new Types.ObjectId(
        createServiceBookingDto.service_provider_id,
      ),
      customer_id: listing.created_by,
      status: BookingStatus.PENDING,
    });
    return booking.save();
  }

  async findAvailableListings(
    listingTypes: string[],
  ): Promise<ListingDocument[]> {
    return this.listingModel
      .find({
        approval_status: ApprovalStatus.APPROVED,
        status: ListingStatus.ACTIVE,
        listing_type: { $in: listingTypes },
      })
      .populate('created_by')
      .populate('job_details.required_skills')
      .exec();
  }

  async findByListing(listingId: string): Promise<ServiceBookingDocument[]> {
    return this.serviceBookingModel
      .find({ listing_id: new Types.ObjectId(listingId) })
      .populate('listing_id')
      .populate('service_provider_id')
      .populate('customer_id')
      .exec();
  }

  async findByServiceProvider(
    serviceProviderId: string,
  ): Promise<ServiceBookingDocument[]> {
    return this.serviceBookingModel
      .find({ service_provider_id: new Types.ObjectId(serviceProviderId) })
      .populate('listing_id')
      .populate('customer_id')
      .exec();
  }

  async findByCustomer(customerId: string): Promise<ServiceBookingDocument[]> {
    return this.serviceBookingModel
      .find({ customer_id: new Types.ObjectId(customerId) })
      .populate('listing_id')
      .populate('service_provider_id')
      .exec();
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateServiceBookingStatusDto,
  ): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Service booking not found');
    }

    booking.status = updateStatusDto.status as BookingStatus;
    return booking.save();
  }

  async withdraw(
    id: string,
    serviceProviderId: string,
  ): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Service booking not found');
    }

    if (booking.service_provider_id.toString() !== serviceProviderId) {
      throw new ForbiddenException('You can only withdraw your own bookings');
    }

    await this.serviceBookingModel.findByIdAndDelete(id).exec();
    return booking;
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceBookingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Service booking not found');
    }
  }
}
