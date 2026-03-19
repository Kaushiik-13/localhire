import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceBookingsController } from './service-bookings.controller';
import { ServiceBookingsService } from './service-bookings.service';
import {
  ServiceBooking,
  ServiceBookingSchema,
} from '../../schemas/service-booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceBooking.name, schema: ServiceBookingSchema },
    ]),
  ],
  controllers: [ServiceBookingsController],
  providers: [ServiceBookingsService],
  exports: [ServiceBookingsService],
})
export class ServiceBookingsModule {}
