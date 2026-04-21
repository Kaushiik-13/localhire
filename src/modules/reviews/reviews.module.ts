import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from '../../schemas/review.schema';
import {
  JobApplication,
  JobApplicationSchema,
} from '../../schemas/job-application.schema';
import { Worker, WorkerSchema } from '../../schemas/worker.schema';
import { Employer, EmployerSchema } from '../../schemas/employer.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import {
  ServiceBooking,
  ServiceBookingSchema,
} from '../../schemas/service-booking.schema';
import { Customer, CustomerSchema } from '../../schemas/customer.schema';
import {
  ServiceProvider,
  ServiceProviderSchema,
} from '../../schemas/service-provider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: Employer.name, schema: EmployerSchema },
      { name: User.name, schema: UserSchema },
      { name: ServiceBooking.name, schema: ServiceBookingSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: ServiceProvider.name, schema: ServiceProviderSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
