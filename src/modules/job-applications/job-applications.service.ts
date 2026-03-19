import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  JobApplication,
  JobApplicationDocument,
} from '../../schemas/job-application.schema';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/create-job-application.dto';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplicationDocument>,
  ) {}

  async create(
    createJobApplicationDto: CreateJobApplicationDto,
  ): Promise<JobApplicationDocument> {
    const application = new this.jobApplicationModel({
      ...createJobApplicationDto,
      listing_id: new Types.ObjectId(createJobApplicationDto.listing_id),
      worker_id: new Types.ObjectId(createJobApplicationDto.worker_id),
      employer_id: new Types.ObjectId(createJobApplicationDto.employer_id),
      applied_at: new Date(),
    });
    return application.save();
  }

  async findAll(): Promise<JobApplicationDocument[]> {
    return this.jobApplicationModel
      .find()
      .populate('listing_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();
  }

  async findOne(id: string): Promise<JobApplicationDocument> {
    const application = await this.jobApplicationModel
      .findById(id)
      .populate('listing_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();
    if (!application) {
      throw new NotFoundException('Job application not found');
    }
    return application;
  }

  async findByListing(listingId: string): Promise<JobApplicationDocument[]> {
    return this.jobApplicationModel
      .find({ listing_id: new Types.ObjectId(listingId) })
      .populate('worker_id')
      .populate('employer_id')
      .exec();
  }

  async findByWorker(workerId: string): Promise<JobApplicationDocument[]> {
    return this.jobApplicationModel
      .find({ worker_id: new Types.ObjectId(workerId) })
      .populate('listing_id')
      .populate('employer_id')
      .exec();
  }

  async update(
    id: string,
    updateJobApplicationDto: UpdateJobApplicationDto,
  ): Promise<JobApplicationDocument> {
    const application = await this.jobApplicationModel
      .findByIdAndUpdate(id, updateJobApplicationDto, { new: true })
      .populate('listing_id')
      .populate('worker_id')
      .populate('employer_id')
      .exec();
    if (!application) {
      throw new NotFoundException('Job application not found');
    }
    return application;
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobApplicationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Job application not found');
    }
  }
}
