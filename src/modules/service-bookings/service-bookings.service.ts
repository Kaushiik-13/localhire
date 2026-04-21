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
  ServiceProvider,
  ServiceProviderDocument,
} from '../../schemas/service-provider.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import {
  CreateServiceBookingDto,
  UpdateServiceBookingStatusDto,
} from './dto/create-service-booking.dto';
import { ApplicationStatus } from '../../common/enums/status.enum';
import { ApprovalStatus } from '../../common/enums/approval.enum';
import { ListingStatus } from '../../common/enums/status.enum';

@Injectable()
export class ServiceBookingsService {
  constructor(
    @InjectModel(ServiceBooking.name)
    private serviceBookingModel: Model<ServiceBookingDocument>,
    @InjectModel(Listing.name)
    private listingModel: Model<ListingDocument>,
    @InjectModel(ServiceProvider.name)
    private serviceProviderModel: Model<ServiceProviderDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  private async getServiceProviderByUserId(
    userId: string,
  ): Promise<ServiceProviderDocument> {
    const serviceProvider = await this.serviceProviderModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .exec();
    if (!serviceProvider) {
      throw new NotFoundException('Service provider profile not found');
    }
    return serviceProvider;
  }

  async create(
    createServiceBookingDto: CreateServiceBookingDto,
    userId: string,
  ): Promise<ServiceBookingDocument> {
    const listing = await this.listingModel.findById(
      createServiceBookingDto.listing_id,
    );
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const serviceProvider = await this.getServiceProviderByUserId(userId);

    const existingBooking = await this.serviceBookingModel.findOne({
      listing_id: new Types.ObjectId(createServiceBookingDto.listing_id),
      service_provider_id: serviceProvider._id,
    });

    if (existingBooking) {
      throw new ForbiddenException(
        'You have already applied to this listing',
      );
    }

    const booking = new this.serviceBookingModel({
      listing_id: new Types.ObjectId(createServiceBookingDto.listing_id),
      service_provider_id: serviceProvider._id,
      customer_id: listing.created_by,
      status: ApplicationStatus.APPLIED,
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

  async findByListing(
    listingId: string,
    userId: string,
  ): Promise<ServiceBookingDocument[]> {
    const listing = await this.listingModel.findById(listingId);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.created_by.toString() !== userId) {
      throw new ForbiddenException(
        'Only the listing owner can view bookings for this listing',
      );
    }

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

  async findByServiceProviderUserId(
    userId: string,
  ): Promise<ServiceBookingDocument[]> {
    const serviceProvider = await this.getServiceProviderByUserId(userId);
    return this.findByServiceProvider(serviceProvider._id.toString());
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
    userId: string,
  ): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Service booking not found');
    }

    const listing = await this.listingModel.findById(booking.listing_id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.created_by.toString() !== userId) {
      throw new ForbiddenException(
        'Only the listing owner can update booking status',
      );
    }

    booking.status = updateStatusDto.status as ApplicationStatus;
    return booking.save();
  }

  async withdraw(
    id: string,
    userId: string,
  ): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Service booking not found');
    }

    const serviceProvider = await this.getServiceProviderByUserId(userId);

    if (booking.service_provider_id.toString() !== serviceProvider._id.toString()) {
      throw new ForbiddenException('You can only withdraw your own bookings');
    }

    await this.serviceBookingModel.findByIdAndDelete(id).exec();
    return booking;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const booking = await this.serviceBookingModel.findById(id);
    if (!booking) {
      throw new NotFoundException('Service booking not found');
    }

    const listing = await this.listingModel.findById(booking.listing_id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const isListingOwner = listing.created_by.toString() === userId;

    let isServiceProvider = false;
    try {
      const serviceProvider = await this.getServiceProviderByUserId(userId);
      isServiceProvider =
        booking.service_provider_id.toString() ===
        serviceProvider._id.toString();
    } catch {
      // User is not a service provider
    }

    if (!isListingOwner && !isServiceProvider) {
      throw new ForbiddenException(
        'Only the listing owner or the involved service provider can delete this booking',
      );
    }

    await this.serviceBookingModel.findByIdAndDelete(id).exec();
    return { message: 'Booking deleted successfully' };
  }
}
