import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobApplicationsController } from './job-applications.controller';
import { JobApplicationsService } from './job-applications.service';
import {
  JobApplication,
  JobApplicationSchema,
} from '../../schemas/job-application.schema';
import { Listing, ListingSchema } from '../../schemas/listing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: Listing.name, schema: ListingSchema },
    ]),
  ],
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService],
  exports: [JobApplicationsService],
})
export class JobApplicationsModule {}
