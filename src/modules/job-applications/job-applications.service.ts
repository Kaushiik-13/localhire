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
import { Worker, WorkerDocument } from '../../schemas/worker.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { ApplicationStatus } from '../../common/enums/status.enum';
import {
  ListingApplicantsOutputDto,
  WorkerApplicationsListOutputDto,
  ApplicationStatusUpdateOutputDto,
  DeleteAllOutputDto,
} from './dto/outputs/job-application.output.dto';

@Injectable()
export class JobApplicationsService {
  constructor(
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplicationDocument>,
    @InjectModel(Listing.name)
    private listingModel: Model<ListingDocument>,
    @InjectModel(Worker.name)
    private workerModel: Model<WorkerDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(
    listingId: string,
    userId: string,
  ): Promise<JobApplicationDocument> {
    const listing = await this.listingModel.findById(listingId);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const worker = await this.workerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    const application = new this.jobApplicationModel({
      listing_id: new Types.ObjectId(listingId),
      worker_id: worker._id,
      employer_id: listing.created_by,
      applied_at: new Date(),
    });
    return application.save();
  }

  async findByWorkerApplications(
    userId: string,
  ): Promise<WorkerApplicationsListOutputDto> {
    const worker = await this.workerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    const applications = await this.jobApplicationModel
      .find({ worker_id: worker._id })
      .populate('listing_id')
      .populate('employer_id')
      .exec();

    return {
      count: applications.length,
      applications: applications.map((app) => {
        const obj = app.toObject() as any;
        return {
          id: (obj._id as any).toString(),
          listing_id: obj.listing_id,
          worker_id: obj.worker_id.toString(),
          employer_id: obj.employer_id,
          status: obj.status,
          applied_at: obj.applied_at,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
        };
      }),
    };
  }

  async findApplicantsByListing(
    listingId: string,
    employerId: string,
  ): Promise<ListingApplicantsOutputDto> {
    const listing = await this.listingModel.findById(listingId);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.created_by.toString() !== employerId) {
      throw new ForbiddenException(
        'You can only view applicants for your own listings',
      );
    }

    const applications = await this.jobApplicationModel
      .find({ listing_id: new Types.ObjectId(listingId) })
      .exec();

    const applicantDtos = await Promise.all(
      applications.map(async (app) => {
        let worker = await this.workerModel.findById(app.worker_id);
        if (!worker) {
          worker = await this.workerModel.findOne({
            user_id: app.worker_id,
          });
        }
        const user = worker
          ? await this.userModel.findById(worker.user_id)
          : await this.userModel.findById(app.worker_id);

        return {
          application_id: app._id.toString(),
          worker_id: app.worker_id.toString(),
          worker_name: user?.name ?? '',
          status: app.status,
        };
      }),
    );

    return {
      listing_id: listingId,
      applicants: applicantDtos,
    };
  }

  async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    employerId: string,
  ): Promise<ApplicationStatusUpdateOutputDto> {
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

    application.status = status;
    await application.save();

    if (status === ApplicationStatus.ACCEPTED) {
      await this.jobApplicationModel
        .updateMany(
          {
            listing_id: application.listing_id,
            _id: { $ne: application._id },
            status: ApplicationStatus.APPLIED,
          },
          { status: ApplicationStatus.REJECTED },
        )
        .exec();

      const worker = await this.workerModel.findById(application.worker_id);
      const user = worker
        ? await this.userModel.findById(worker.user_id)
        : null;

      await this.listingModel
        .updateOne(
          { _id: application.listing_id },
          {
            accepted_worker: {
              worker_id: application.worker_id,
              worker_name: user?.name ?? '',
              application_id: application._id,
              status: 'accepted',
              accepted_at: new Date(),
            },
          },
        )
        .exec();
    }

    return {
      id: application._id.toString(),
      status: application.status,
      message: 'Application status updated successfully',
    };
  }

  async withdrawApplication(
    id: string,
    userId: string,
  ): Promise<ApplicationStatusUpdateOutputDto> {
    const application = await this.jobApplicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    const worker = await this.workerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!worker || application.worker_id.toString() !== worker._id.toString()) {
      throw new ForbiddenException(
        'You can only withdraw your own applications',
      );
    }

    if (application.status !== ApplicationStatus.APPLIED) {
      throw new ForbiddenException(
        "Only applications with 'applied' status can be withdrawn",
      );
    }

    application.status = ApplicationStatus.WITHDRAWN;
    await application.save();

    return {
      id: application._id.toString(),
      status: application.status,
      message: 'Application withdrawn successfully',
    };
  }

  async deleteAll(): Promise<DeleteAllOutputDto> {
    const result = await this.jobApplicationModel.deleteMany({}).exec();
    return {
      message: 'All job applications deleted successfully',
      deletedCount: result.deletedCount,
    };
  }
}
