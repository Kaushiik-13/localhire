import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employer, EmployerDocument } from '../../schemas/employer.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateEmployerInputDto } from './dto/inputs/employer.input.dto';
import { UpdateEmployerInputDto } from './dto/inputs/employer.input.dto';
import { Role } from '../../common/enums/roles.enum';

@Injectable()
export class EmployersService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createEmployerDto: CreateEmployerInputDto,
    userId: string,
  ): Promise<EmployerDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.roles.includes(Role.EMPLOYER)) {
      throw new BadRequestException('User does not have employer role');
    }

    const existingEmployer = await this.employerModel.findOne({
      user_id: userId,
    });
    if (existingEmployer) {
      throw new ConflictException(
        'Employer profile already exists for this user',
      );
    }

    const employer = new this.employerModel({
      ...createEmployerDto,
      user_id: new Types.ObjectId(userId),
    });
    return employer.save();
  }

  async findAll(): Promise<EmployerDocument[]> {
    return this.employerModel.find().populate('user_id').exec();
  }

  async findOne(id: string): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findById(id)
      .populate('user_id')
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
      .exec();
  }

  async update(
    id: string,
    updateEmployerDto: UpdateEmployerInputDto,
  ): Promise<EmployerDocument> {
    const employer = await this.employerModel
      .findByIdAndUpdate(id, updateEmployerDto, { new: true })
      .populate('user_id')
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
