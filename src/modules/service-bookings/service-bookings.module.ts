import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceBookingsController } from './service-bookings.controller';
import { ServiceBookingsService } from './service-bookings.service';
import {
  ServiceBooking,
  ServiceBookingSchema,
} from '../../schemas/service-booking.schema';
import { Listing, ListingSchema } from '../../schemas/listing.schema';
import {
  ServiceProvider,
  ServiceProviderSchema,
} from '../../schemas/service-provider.schema';
import { Worker, WorkerSchema } from '../../schemas/worker.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { Skill, SkillSchema } from '../../schemas/skill.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceBooking.name, schema: ServiceBookingSchema },
      { name: Listing.name, schema: ListingSchema },
      { name: ServiceProvider.name, schema: ServiceProviderSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: User.name, schema: UserSchema },
      { name: Skill.name, schema: SkillSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [ServiceBookingsController],
  providers: [ServiceBookingsService],
  exports: [ServiceBookingsService],
})
export class ServiceBookingsModule {}
