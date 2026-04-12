import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../../schemas/review.schema';
import {
  JobApplication,
  JobApplicationDocument,
} from '../../schemas/job-application.schema';
import { Worker, WorkerDocument } from '../../schemas/worker.schema';
import { Employer, EmployerDocument } from '../../schemas/employer.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { ApplicationStatus } from '../../common/enums/status.enum';
import { CreateReviewInputDto } from './dto/inputs/create-review.input.dto';
import {
  ReviewOutputDto,
  ReviewListOutputDto,
  ReviewMessageOutputDto,
} from './dto/outputs/review.output.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplicationDocument>,
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createReviewDto: CreateReviewInputDto,
    reviewerId: string,
  ): Promise<ReviewOutputDto> {
    const application = await this.jobApplicationModel
      .findById(createReviewDto.job_application_id)
      .exec();

    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    if (application.status !== ApplicationStatus.ACCEPTED) {
      throw new ForbiddenException('Can only review accepted job applications');
    }

    const existingReview = await this.reviewModel
      .findOne({
        job_application_id: new Types.ObjectId(
          createReviewDto.job_application_id,
        ),
        reviewer_id: new Types.ObjectId(reviewerId),
      })
      .exec();

    if (existingReview) {
      throw new ForbiddenException(
        'You have already reviewed this application',
      );
    }

    const worker = await this.workerModel.findOne({
      user_id: new Types.ObjectId(reviewerId),
    });

    if (worker) {
      if (application.worker_id.toString() !== worker._id.toString()) {
        throw new ForbiddenException(
          'You can only review applications you applied to',
        );
      }

      const review = new this.reviewModel({
        reviewer_id: new Types.ObjectId(reviewerId),
        review_type: 'job',
        job_application_id: new Types.ObjectId(
          createReviewDto.job_application_id,
        ),
        employer_id: application.employer_id,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      });
      const saved = await review.save();
      return this.populateReview(saved);
    }

    const employer = await this.employerModel.findOne({
      user_id: new Types.ObjectId(reviewerId),
    });

    if (employer) {
      if (application.employer_id.toString() !== employer._id.toString()) {
        throw new ForbiddenException(
          'You can only review applications for your own listings',
        );
      }

      const review = new this.reviewModel({
        reviewer_id: new Types.ObjectId(reviewerId),
        review_type: 'job',
        job_application_id: new Types.ObjectId(
          createReviewDto.job_application_id,
        ),
        worker_id: application.worker_id,
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
      });
      const saved = await review.save();
      return this.populateReview(saved);
    }

    throw new ForbiddenException(
      'Only workers or employers involved in this application can review',
    );
  }

  private async populateReview(
    review: ReviewDocument,
  ): Promise<ReviewOutputDto> {
    const populated = await this.reviewModel
      .findById(review._id)
      .populate('reviewer_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();

    if (!populated) {
      throw new NotFoundException('Review not found after creation');
    }

    return this.mapToOutputDto(populated);
  }

  private mapToOutputDto(review: any): ReviewOutputDto {
    const obj = review.toObject ? review.toObject() : review;
    return {
      id: (obj._id as any).toString(),
      reviewer_id: obj.reviewer_id
        ? {
            id:
              (obj.reviewer_id._id as any)?.toString() ??
              obj.reviewer_id.toString(),
            name: obj.reviewer_id.name ?? '',
          }
        : { id: obj.reviewer_id?.toString() ?? '', name: '' },
      review_type: obj.review_type,
      job_application_id: obj.job_application_id?.toString(),
      worker_id: obj.worker_id
        ? {
            id:
              (obj.worker_id._id as any)?.toString() ??
              obj.worker_id.toString(),
            name: obj.worker_id.name ?? '',
          }
        : undefined,
      employer_id: obj.employer_id
        ? {
            id:
              (obj.employer_id._id as any)?.toString() ??
              obj.employer_id.toString(),
            business_name: obj.employer_id.business_name ?? '',
          }
        : undefined,
      rating: obj.rating,
      comment: obj.comment,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  async findMyReviews(userId: string): Promise<ReviewListOutputDto> {
    const worker = await this.workerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    const employer = await this.employerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });

    const orConditions: any[] = [];

    if (worker) {
      orConditions.push({ worker_id: worker._id });
    }
    if (employer) {
      orConditions.push({ employer_id: employer._id });
    }

    if (orConditions.length === 0) {
      throw new NotFoundException('No profile found for this user');
    }

    const reviews = await this.reviewModel
      .find({ $or: orConditions })
      .populate('reviewer_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();

    return {
      count: reviews.length,
      reviews: reviews.map((r) => this.mapToOutputDto(r)),
    };
  }

  async findByUserId(userId: string): Promise<ReviewListOutputDto> {
    const worker = await this.workerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    const employer = await this.employerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });

    const orConditions: any[] = [];

    if (worker) {
      orConditions.push({ worker_id: worker._id });
    }
    if (employer) {
      orConditions.push({ employer_id: employer._id });
    }

    if (orConditions.length === 0) {
      throw new NotFoundException('No profile found for this user');
    }

    const reviews = await this.reviewModel
      .find({ $or: orConditions })
      .populate('reviewer_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();

    return {
      count: reviews.length,
      reviews: reviews.map((r) => this.mapToOutputDto(r)),
    };
  }

  async findOne(id: string): Promise<ReviewOutputDto> {
    const review = await this.reviewModel
      .findById(id)
      .populate('reviewer_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.mapToOutputDto(review);
  }

  async remove(id: string): Promise<ReviewMessageOutputDto> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Review not found');
    }
    return { message: 'Review deleted successfully' };
  }
}
