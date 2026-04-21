import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Listing, ListingDocument } from '../../schemas/listing.schema';
import { CreateListingInputDto } from './dto/inputs/listing.input.dto';
import { UpdateListingInputDto } from './dto/inputs/listing.input.dto';
import { ApprovalStatus } from '../../common/enums/approval.enum';
import { ListingStatus } from '../../common/enums/status.enum';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
  ) {}

  async create(
    createListingDto: CreateListingInputDto,
    userId: string,
    createdByRole: string,
  ): Promise<ListingDocument> {
    const listing = new this.listingModel({
      ...createListingDto,
      created_by: new Types.ObjectId(userId),
      created_by_role: createdByRole,
      job_details: createListingDto.job_details
        ? {
            ...createListingDto.job_details,
            required_skills:
              createListingDto.job_details.required_skills?.map(
                (s) => new Types.ObjectId(s),
              ) || [],
          }
        : undefined,
    });
    return listing.save();
  }

  async findAll(): Promise<ListingDocument[]> {
    return this.listingModel
      .find()
      .populate('created_by')
      .populate('job_details.required_skills')
      .exec();
  }

  async findOne(id: string): Promise<ListingDocument> {
    const listing = await this.listingModel
      .findById(id)
      .populate('created_by')
      .populate('job_details.required_skills')
      .exec();
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async findByEmployer(employerId: string): Promise<ListingDocument[]> {
    return this.listingModel
      .find({ created_by: new Types.ObjectId(employerId) })
      .populate('created_by')
      .populate('job_details.required_skills')
      .exec();
  }

  async findByCreator(userId: string): Promise<ListingDocument[]> {
    return this.listingModel
      .find({ created_by: new Types.ObjectId(userId) })
      .populate('created_by')
      .populate('job_details.required_skills')
      .exec();
  }

  async findByType(listingType: string): Promise<ListingDocument[]> {
    return this.listingModel
      .find({ listing_type: listingType })
      .populate('created_by')
      .exec();
  }

  async update(
    id: string,
    updateListingDto: UpdateListingInputDto,
    userId: string,
  ): Promise<ListingDocument> {
    const listing = await this.listingModel.findById(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.created_by.toString() !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }
    const updated = await this.listingModel
      .findByIdAndUpdate(id, updateListingDto, { new: true })
      .populate('created_by')
      .exec();
    if (!updated) {
      throw new NotFoundException('Listing not found');
    }
    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const listing = await this.listingModel.findById(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (listing.created_by.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }
    await this.listingModel.findByIdAndDelete(id).exec();
  }

  async findByApprovalStatus(
    approvalStatus: ApprovalStatus,
  ): Promise<ListingDocument[]> {
    return this.listingModel
      .find({ approval_status: approvalStatus })
      .populate('created_by')
      .populate('job_details.required_skills')
      .exec();
  }

  async approveListing(id: string, adminId: string): Promise<ListingDocument> {
    const listing = await this.listingModel.findById(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.approval_status === ApprovalStatus.APPROVED) {
      throw new ForbiddenException('Listing is already approved');
    }

    listing.approval_status = ApprovalStatus.APPROVED;
    listing.approved_by = new Types.ObjectId(adminId);
    listing.approved_at = new Date();
    listing.status = ListingStatus.ACTIVE;

    return listing.save();
  }

  async rejectListing(id: string, adminId: string): Promise<ListingDocument> {
    const listing = await this.listingModel.findById(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.approval_status === ApprovalStatus.REJECTED) {
      throw new ForbiddenException('Listing is already rejected');
    }

    listing.approval_status = ApprovalStatus.REJECTED;
    listing.approved_by = new Types.ObjectId(adminId);
    listing.approved_at = new Date();

    return listing.save();
  }
}
