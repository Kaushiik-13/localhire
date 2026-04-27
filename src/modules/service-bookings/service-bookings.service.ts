import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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
import { Worker, WorkerDocument } from '../../schemas/worker.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import {
  CreateServiceBookingDto,
  CreateDirectBookingDto,
  UpdateServiceBookingStatusDto,
} from './dto/create-service-booking.dto';
import { ApplicationStatus } from '../../common/enums/status.enum';
import { ApprovalStatus } from '../../common/enums/approval.enum';
import { ListingStatus } from '../../common/enums/status.enum';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ServiceBookingsService {
  constructor(
    @InjectModel(ServiceBooking.name)
    private serviceBookingModel: Model<ServiceBookingDocument>,
    @InjectModel(Listing.name)
    private listingModel: Model<ListingDocument>,
    @InjectModel(ServiceProvider.name)
    private serviceProviderModel: Model<ServiceProviderDocument>,
    @InjectModel(Worker.name)
    private workerModel: Model<WorkerDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private notificationsService: NotificationsService,
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

    let serviceProvider: ServiceProviderDocument;

    if (createServiceBookingDto.service_provider_id) {
      const sp = await this.serviceProviderModel
        .findById(createServiceBookingDto.service_provider_id)
        .exec();
      if (!sp) {
        throw new NotFoundException('Service provider not found');
      }
      serviceProvider = sp;
    } else {
      serviceProvider = await this.getServiceProviderByUserId(userId);
    }

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
      booking_type: 'listing',
    });
    return booking.save();
  }

  async createDirect(
    customerId: string,
    dto: CreateDirectBookingDto,
  ): Promise<ServiceBookingDocument> {
    const provider = await this.serviceProviderModel.findById(dto.service_provider_id).exec();
    if (!provider) {
      throw new NotFoundException('Service provider not found');
    }

    const user = await this.userModel.findById(provider.user_id).exec();
    if (!user || user.status !== 'active') {
      throw new BadRequestException('Service provider is not active');
    }

    const bookingData: Record<string, unknown> = {
      service_provider_id: new Types.ObjectId(dto.service_provider_id),
      customer_id: new Types.ObjectId(customerId),
      status: ApplicationStatus.APPLIED,
      booking_type: 'direct',
    };

    if (dto.listing_id) {
      bookingData['listing_id'] = new Types.ObjectId(dto.listing_id);
    }
    if (dto.service_category) {
      bookingData['service_category'] = dto.service_category;
    }
    if (dto.description) {
      bookingData['description'] = dto.description;
    }
    if (dto.address) {
      bookingData['address'] = dto.address;
    }
    if (dto.preferred_date) {
      bookingData['preferred_date'] = new Date(dto.preferred_date);
    }
    if (dto.budget !== undefined) {
      bookingData['budget'] = dto.budget;
    }

    const booking = new this.serviceBookingModel(bookingData);
    const saved = await booking.save();

    await this.notificationsService.create({
      user_id: provider.user_id.toString(),
      title: 'New Booking Request',
      message: 'You have a new direct booking request from a customer.',
      type: 'booking_update',
      reference_id: saved._id.toString(),
      reference_type: 'service_booking',
    });

    return saved;
  }

  async findById(
    bookingId: string,
    userId: string,
    roles: string[],
  ): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel.findById(bookingId).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (roles.includes('admin')) {
      return booking;
    }

    if (booking.customer_id.toString() === userId) {
      return booking;
    }

    if (roles.includes('service_provider')) {
      try {
        const serviceProvider = await this.getServiceProviderByUserId(userId);
        if (booking.service_provider_id.toString() === serviceProvider._id.toString()) {
          return booking;
        }
      } catch {
        // User is not a service provider
      }
    }

    if (roles.includes('worker')) {
      try {
        const worker = await this.workerModel
          .findOne({ user_id: new Types.ObjectId(userId) })
          .exec();
        if (worker && booking.service_provider_id.toString() === worker._id.toString()) {
          return booking;
        }
      } catch {
        // User is not a worker
      }
    }

    throw new ForbiddenException('You do not have access to this booking');
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
      .sort({ createdAt: -1 })
      .exec();
  }

  async cancel(
    bookingId: string,
    customerId: string,
  ): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel.findById(bookingId).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customer_id.toString() !== customerId) {
      throw new ForbiddenException('Only the customer can cancel');
    }

    if (
      booking.status === ApplicationStatus.COMPLETED ||
      booking.status === ApplicationStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot cancel a ${booking.status} booking`,
      );
    }

    booking.status = ApplicationStatus.CANCELLED;
    const saved = await booking.save();

    const provider = await this.serviceProviderModel
      .findById(booking.service_provider_id)
      .exec();
    if (provider) {
      await this.notificationsService.create({
        user_id: provider.user_id.toString(),
        title: 'Booking Cancelled',
        message: 'A customer has cancelled their booking.',
        type: 'booking_update',
        reference_id: saved._id.toString(),
        reference_type: 'service_booking',
      });
    }

    return saved;
  }

  async complete(
    bookingId: string,
    userId: string,
  ): Promise<ServiceBookingDocument> {
    const booking = await this.serviceBookingModel.findById(bookingId).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const isParticipant =
      booking.customer_id.toString() === userId ||
      booking.service_provider_id.toString() === userId;

    if (!isParticipant) {
      throw new ForbiddenException(
        'Only the customer or provider can complete',
      );
    }

    if (booking.status !== ApplicationStatus.ACCEPTED) {
      throw new BadRequestException(
        'Booking must be accepted before completing',
      );
    }

    booking.status = ApplicationStatus.COMPLETED;
    const saved = await booking.save();

    const recipientId =
      booking.customer_id.toString() === userId
        ? booking.service_provider_id.toString()
        : booking.customer_id.toString();

    const recipientType =
      booking.customer_id.toString() === userId ? 'service_provider' : 'customer';

    let recipientUserId: string;
    if (recipientType === 'service_provider') {
      const provider = await this.serviceProviderModel
        .findById(booking.service_provider_id)
        .exec();
      recipientUserId = provider?.user_id?.toString() || recipientId;
    } else {
      recipientUserId = booking.customer_id.toString();
    }

    await this.notificationsService.create({
      user_id: recipientUserId,
      title: 'Booking Completed',
      message: 'A booking has been marked as completed. Please leave a review!',
      type: 'booking_update',
      reference_id: saved._id.toString(),
      reference_type: 'service_booking',
    });

    return saved;
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

    if (booking.booking_type === 'listing' && booking.listing_id) {
      const listing = await this.listingModel.findById(booking.listing_id);
      if (!listing) {
        throw new NotFoundException('Listing not found');
      }

      if (listing.created_by.toString() !== userId) {
        throw new ForbiddenException(
          'Only the listing owner can update booking status',
        );
      }
    } else {
      if (booking.customer_id.toString() !== userId) {
        throw new ForbiddenException(
          'Only the customer can update booking status',
        );
      }
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

    if (booking.booking_type === 'listing' && booking.listing_id) {
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
    } else {
      const isCustomer = booking.customer_id.toString() === userId;
      let isServiceProvider = false;
      try {
        const serviceProvider = await this.getServiceProviderByUserId(userId);
        isServiceProvider =
          booking.service_provider_id.toString() ===
          serviceProvider._id.toString();
      } catch {
        // User is not a service provider
      }

      if (!isCustomer && !isServiceProvider) {
        throw new ForbiddenException(
          'Only the customer or the involved service provider can delete this booking',
        );
      }
    }

    await this.serviceBookingModel.findByIdAndDelete(id).exec();
    return { message: 'Booking deleted successfully' };
  }
}
