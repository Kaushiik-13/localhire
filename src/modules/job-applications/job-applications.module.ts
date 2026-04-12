import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobApplicationsController } from './job-applications.controller';
import { JobApplicationsService } from './job-applications.service';
import {
  JobApplication,
  JobApplicationSchema,
} from '../../schemas/job-application.schema';
import { Listing, ListingSchema } from '../../schemas/listing.schema';
import { Worker, WorkerSchema } from '../../schemas/worker.schema';
import { Employer, EmployerSchema } from '../../schemas/employer.schema';
import { User, UserSchema } from '../../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: Listing.name, schema: ListingSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: Employer.name, schema: EmployerSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService],
  exports: [JobApplicationsService],
})
export class JobApplicationsModule {}
