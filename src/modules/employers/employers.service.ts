import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employer, EmployerDocument } from '../../schemas/employer.schema';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/create-employer.dto';

@Injectable()
export class EmployersService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
  ) {}

  async create(
    createEmployerDto: CreateEmployerDto,
  ): Promise<EmployerDocument> {
    const employer = new this.employerModel({
      ...createEmployerDto,
      user_id: new Types.ObjectId(createEmployerDto.user_id),
      category_id: createEmployerDto.category_id
        ? new Types.ObjectId(createEmployerDto.category_id)
        : undefined,
    });
    return employer.save();
  }

  async findAll(): Promise<EmployerDocument[]> {
    return this.employerModel
      .find()
      .populate('user_id')
      .populate('category_id')
      .exec();
  }

  async findOne(id: string): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findById(id)
      .populate('user_id')
      .populate('category_id')
      .exec();
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    return employer;
  }

  async findByUserId(userId: string): Promise<EmployerDocument | null> {
    return this.employerModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .populate('category_id')
      .exec();
  }

  async update(
    id: string,
    updateEmployerDto: UpdateEmployerDto,
  ): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findByIdAndUpdate(id, updateEmployerDto, { new: true })
      .populate('user_id')
      .populate('category_id')
      .exec();
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    return employer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.employerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Employer not found');
    }
  }
}
