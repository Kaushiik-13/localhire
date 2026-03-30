import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../../schemas/user.schema';
import { Worker, WorkerSchema } from '../../schemas/worker.schema';
import { Employer, EmployerSchema } from '../../schemas/employer.schema';
import {
  ServiceProvider,
  ServiceProviderSchema,
} from '../../schemas/service-provider.schema';
import { Listing, ListingSchema } from '../../schemas/listing.schema';
import {
  JobApplication,
  JobApplicationSchema,
} from '../../schemas/job-application.schema';
import {
  ServiceBooking,
  ServiceBookingSchema,
} from '../../schemas/service-booking.schema';
import { Skill, SkillSchema } from '../../schemas/skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: Employer.name, schema: EmployerSchema },
      { name: ServiceProvider.name, schema: ServiceProviderSchema },
      { name: Listing.name, schema: ListingSchema },
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: ServiceBooking.name, schema: ServiceBookingSchema },
      { name: Skill.name, schema: SkillSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
