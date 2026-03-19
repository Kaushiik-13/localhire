import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Listing, ListingDocument } from '../../schemas/listing.schema';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(
    @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
  ) {}

  async create(createListingDto: CreateListingDto): Promise<ListingDocument> {
    const listing = new this.listingModel({
      ...createListingDto,
      created_by: new Types.ObjectId(createListingDto.created_by),
      category_id: createListingDto.category_id
        ? new Types.ObjectId(createListingDto.category_id)
        : undefined,
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
      .populate('category_id')
      .populate('job_details.required_skills')
      .exec();
  }

  async findOne(id: string): Promise<ListingDocument> {
    const listing = await this.listingModel
      .findById(id)
      .populate('created_by')
      .populate('category_id')
      .populate('job_details.required_skills')
      .exec();
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async findByCategory(categoryId: string): Promise<ListingDocument[]> {
    return this.listingModel
      .find({ category_id: new Types.ObjectId(categoryId) })
      .populate('created_by')
      .populate('category_id')
      .exec();
  }

  async findByType(listingType: string): Promise<ListingDocument[]> {
    return this.listingModel
      .find({ listing_type: listingType })
      .populate('created_by')
      .populate('category_id')
      .exec();
  }

  async update(
    id: string,
    updateListingDto: UpdateListingDto,
  ): Promise<ListingDocument> {
    const listing = await this.listingModel
      .findByIdAndUpdate(id, updateListingDto, { new: true })
      .populate('created_by')
      .populate('category_id')
      .exec();
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async remove(id: string): Promise<void> {
    const result = await this.listingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Listing not found');
    }
  }
}
