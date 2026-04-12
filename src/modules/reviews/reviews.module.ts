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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: Worker.name, schema: WorkerSchema },
      { name: Employer.name, schema: EmployerSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
