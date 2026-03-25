import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from '../../schemas/worker.schema';
import { CreateWorkerInputDto } from './dto/inputs/worker.input.dto';
import { UpdateWorkerInputDto } from './dto/inputs/worker.input.dto';
import { WorkerOutputDto } from './dto/outputs/worker.output.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
  ) {}

  async create(createWorkerDto: CreateWorkerInputDto): Promise<WorkerDocument> {
    const worker = new this.workerModel({
      ...createWorkerDto,
      user_id: new Types.ObjectId(createWorkerDto.user_id),
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

  async update(
    id: string,
    updateWorkerDto: UpdateWorkerInputDto,
  ): Promise<WorkerDocument> {
    const updateData: Record<string, unknown> = { ...updateWorkerDto };
    if (updateWorkerDto.available_from) {
      updateData['available_from'] = new Date(updateWorkerDto.available_from);
    }
    if (updateWorkerDto.skills) {
      updateData['skills'] = updateWorkerDto.skills.map(
        (s) => new Types.ObjectId(s),
      );
    }

    const worker = await this.workerModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('user_id')
      .populate('skills')
      .exec();
    if (!worker) {
      throw new NotFoundException('Worker not found');
    }
    return worker;
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
}
