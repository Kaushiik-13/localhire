import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from '../../schemas/customer.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import {
  CreateCustomerInputDto,
  UpdateCustomerInputDto,
  UpdateCustomerProfileInputDto,
} from './dto/inputs/customer.input.dto';
import { Role } from '../../common/enums/roles.enum';
import { UserStatus } from '../../common/enums/status.enum';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createCustomerDto: CreateCustomerInputDto,
    userId: string,
  ): Promise<CustomerDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.roles.includes(Role.CUSTOMER)) {
      throw new BadRequestException('User does not have customer role');
    }

    const existingCustomer = await this.customerModel.findOne({
      user_id: userId,
    });
    if (existingCustomer) {
      throw new ConflictException(
        'Customer profile already exists for this user',
      );
    }

    const customer = new this.customerModel({
      ...createCustomerDto,
      user_id: new Types.ObjectId(userId),
    });
    return customer.save();
  }

  async findAll(): Promise<CustomerDocument[]> {
    return this.customerModel.find().populate('user_id').exec();
  }

  async findOne(id: string): Promise<CustomerDocument> {
    const customer = await this.customerModel
      .findById(id)
      .populate('user_id')
      .exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async findByUserId(userId: string): Promise<CustomerDocument | null> {
    return this.customerModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .exec();
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerInputDto,
  ): Promise<CustomerDocument> {
    const customer = await this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, { new: true })
      .populate('user_id')
      .exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Customer not found');
    }
  }

  async getOwnProfile(userId: string): Promise<CustomerDocument> {
    const customer = await this.customerModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .exec();
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    return customer;
  }

  async toggleStatus(userId: string): Promise<CustomerDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status =
      user.status === UserStatus.ACTIVE
        ? UserStatus.DEACTIVE
        : UserStatus.ACTIVE;
    await user.save();
    return this.getOwnProfile(userId);
  }

  async updateOwnProfile(
    userId: string,
    dto: UpdateCustomerProfileInputDto,
  ): Promise<CustomerDocument> {
    const customer = await this.customerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    const customerUpdateData: Record<string, unknown> = { ...dto };
    delete customerUpdateData.user;

    await this.customerModel.findByIdAndUpdate(customer._id, customerUpdateData);

    if (dto.user) {
      const userUpdateData: Record<string, unknown> = {};
      if (dto.user.name !== undefined) userUpdateData['name'] = dto.user.name;
      if (dto.user.email !== undefined) userUpdateData['email'] = dto.user.email;
      if (dto.user.profile_photo !== undefined)
        userUpdateData['profile_photo'] = dto.user.profile_photo;
      if (dto.user.language !== undefined)
        userUpdateData['language'] = dto.user.language;

      if (Object.keys(userUpdateData).length > 0) {
        await this.userModel.findByIdAndUpdate(userId, userUpdateData);
      }
    }

    return this.getOwnProfile(userId);
  }

  async deleteOwnProfile(userId: string): Promise<{ message: string }> {
    const customer = await this.customerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    await this.customerModel.findByIdAndDelete(customer._id);
    await this.userModel.findByIdAndDelete(userId);

    return { message: 'Customer profile and user account deleted successfully' };
  }
}
