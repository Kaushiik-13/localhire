import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  JobApplication,
  JobApplicationDocument,
} from '../../schemas/job-application.schema';
import { Listing, ListingDocument } from '../../schemas/listing.schema';
import {
  CreateJobApplicationInputDto,
  UpdateApplicationStatusInputDto,
} from './dto/inputs/job-application.input.dto';
import { ApprovalStatus } from '../../common/enums/approval.enum';
import {
  ListingStatus,
  ApplicationStatus,
} from '../../common/enums/status.enum';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplicationDocument>,
    @InjectModel(Listing.name)
    private listingModel: Model<ListingDocument>,
  ) {}

  async create(
    createJobApplicationDto: CreateJobApplicationInputDto,
  ): Promise<JobApplicationDocument> {
    const listing = await this.listingModel.findById(
      createJobApplicationDto.listing_id,
    );
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const application = new this.jobApplicationModel({
      listing_id: new Types.ObjectId(createJobApplicationDto.listing_id),
      worker_id: new Types.ObjectId(createJobApplicationDto.worker_id),
      employer_id: listing.created_by,
      applied_at: new Date(),
    });
    return application.save();
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

  async remove(id: string): Promise<void> {
    const result = await this.jobApplicationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Job application not found');
    }
  }

  async findAvailableListings(
    listingTypes: string[],
  ): Promise<ListingDocument[]> {
    return this.listingModel
      .find({
        approval_status: ApprovalStatus.APPROVED,
        status: ListingStatus.ACTIVE,
        listing_type: { $in: listingTypes },
      })
      .populate('created_by')
      .populate('job_details.required_skills')
      .exec();
  }

  async updateApplicationStatus(
    id: string,
    updateStatusDto: UpdateApplicationStatusInputDto,
    employerId: string,
  ): Promise<JobApplicationDocument> {
    const application = await this.jobApplicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    if (application.employer_id.toString() !== employerId) {
      throw new ForbiddenException(
        'You can only update applications for your own listings',
      );
    }

    if (application.status !== ApplicationStatus.APPLIED) {
      throw new ForbiddenException('Application has already been processed');
    }

    application.status = updateStatusDto.status;
    return application.save();
  }

  async findByEmployer(employerId: string): Promise<JobApplicationDocument[]> {
    return this.jobApplicationModel
      .find({ employer_id: new Types.ObjectId(employerId) })
      .populate('listing_id')
      .populate('worker_id')
      .exec();
  }

  async withdrawApplication(
    id: string,
    workerId: string,
  ): Promise<JobApplicationDocument> {
    const application = await this.jobApplicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    if (application.worker_id.toString() !== workerId) {
      throw new ForbiddenException(
        'You can only withdraw your own applications',
      );
    }

    if (application.status !== ApplicationStatus.APPLIED) {
      throw new ForbiddenException(
        'You can only withdraw applications with status applied',
      );
    }

    application.status = ApplicationStatus.WITHDRAWN;
    return application.save();
  }
}
