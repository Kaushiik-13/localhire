import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../../schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
    const review = new this.reviewModel({
      ...createReviewDto,
      reviewer_id: new Types.ObjectId(createReviewDto.reviewer_id),
      worker_id: new Types.ObjectId(createReviewDto.worker_id),
      booking_id: createReviewDto.booking_id
        ? new Types.ObjectId(createReviewDto.booking_id)
        : undefined,
      job_application_id: createReviewDto.job_application_id
        ? new Types.ObjectId(createReviewDto.job_application_id)
        : undefined,
    });
    return review.save();
  }

  async findAll(): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find()
      .populate('reviewer_id')
      .populate('worker_id')
      .exec();
  }

  async findOne(id: string): Promise<ReviewDocument> {
    const review = await this.reviewModel
      .findById(id)
      .populate('reviewer_id')
      .populate('worker_id')
      .exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async findByWorker(workerId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ worker_id: new Types.ObjectId(workerId) })
      .populate('reviewer_id')
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Review not found');
    }
  }
}
