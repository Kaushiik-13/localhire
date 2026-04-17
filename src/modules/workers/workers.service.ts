import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from '../../schemas/worker.schema';
import { User, UserDocument } from '../../schemas/user.schema';
import {
  CreateWorkerInputDto,
  UpdateWorkerProfileInputDto,
} from './dto/inputs/worker.input.dto';
import { Role } from '../../common/enums/roles.enum';
import { UserStatus } from '../../common/enums/status.enum';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(
    createWorkerDto: CreateWorkerInputDto,
    userId: string,
  ): Promise<WorkerDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.roles.includes(Role.WORKER)) {
      throw new BadRequestException('User does not have worker role');
    }

    const existingWorker = await this.workerModel.findOne({ user_id: userId });
    if (existingWorker) {
      throw new ConflictException(
        'Worker profile already exists for this user',
      );
    }

    const worker = new this.workerModel({
      ...createWorkerDto,
      user_id: new Types.ObjectId(userId),
      skills: createWorkerDto.skills?.map((s) => new Types.ObjectId(s)) || [],
      available_from: createWorkerDto.available_from
        ? new Date(createWorkerDto.available_from)
        : undefined,
    });
    return worker.save();
  }

  async findAll(): Promise<WorkerDocument[]> {
    return this.workerModel
      .find()
      .populate('user_id')
      .populate('skills')
      .exec();
  }

  async findOne(id: string): Promise<WorkerDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid ID');
    }
    const worker = await this.workerModel
      .findById(id)
      .populate('user_id')
      .populate('skills')
      .exec();
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    return worker;
  }

  async findByUserId(userId: string): Promise<WorkerDocument | null> {
    return this.workerModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .populate('skills')
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.workerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Worker not found');
    }
  }

  async updateRating(
    workerId: string,
    rating: number,
  ): Promise<WorkerDocument> {
    const worker = await this.workerModel.findById(workerId);
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    worker.rating = rating;
    return worker.save();
  }

  async incrementCompletedJobs(workerId: string): Promise<WorkerDocument> {
    const worker = await this.workerModel.findByIdAndUpdate(
      workerId,
      { $inc: { completed_jobs: 1 } },
      { new: true },
    );
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    return worker;
  }

  async getOwnProfile(userId: string): Promise<WorkerDocument> {
    const worker = await this.workerModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .populate('user_id')
      .populate('skills')
      .exec();
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }
    return worker;
  }

  async toggleStatus(userId: string): Promise<WorkerDocument> {
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
    dto: UpdateWorkerProfileInputDto,
  ): Promise<WorkerDocument> {
    const worker = await this.workerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    const workerUpdateData: Record<string, unknown> = { ...dto };
    delete workerUpdateData.user;
    if (dto.skills) {
      workerUpdateData['skills'] = dto.skills.map((s) => new Types.ObjectId(s));
    }
    if (dto.available_from) {
      workerUpdateData['available_from'] = new Date(dto.available_from);
    }

    await this.workerModel.findByIdAndUpdate(worker._id, workerUpdateData);

    if (dto.user) {
      const userUpdateData: Record<string, unknown> = { ...dto.user };
      if (dto.user.address) {
        delete userUpdateData.address;
        const user = await this.userModel.findById(userId);
        const existingAddresses = user?.addresses || [];
        if (existingAddresses.length > 0) {
          userUpdateData['addresses.0'] = {
            ...existingAddresses[0].toObject(),
            ...dto.user.address,
          };
        } else {
          userUpdateData['$push'] = { addresses: dto.user.address };
        }
      }
      await this.userModel.findByIdAndUpdate(userId, userUpdateData);
    }

    return this.getOwnProfile(userId);
  }

  async deleteOwnProfile(userId: string): Promise<{ message: string }> {
    const worker = await this.workerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    if (!worker) {
      throw new NotFoundException('Worker profile not found');
    }

    await this.workerModel.findByIdAndDelete(worker._id);
    await this.userModel.findByIdAndDelete(userId);

    return { message: 'Worker profile and user account deleted successfully' };
  }
}
