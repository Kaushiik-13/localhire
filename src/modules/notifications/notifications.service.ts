import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      ...createNotificationDto,
      user_id: new Types.ObjectId(createNotificationDto.user_id),
      reference_id: createNotificationDto.reference_id
        ? new Types.ObjectId(createNotificationDto.reference_id)
        : undefined,
    });
    return notification.save();
  }

  async findAll(): Promise<NotificationDocument[]> {
    return this.notificationModel.find().populate('user_id').exec();
  }

  async findByUser(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ user_id: new Types.ObjectId(userId) })
      .sort({ created_at: -1 })
      .exec();
  }

  async findOne(id: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel
      .findById(id)
      .populate('user_id')
      .exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAsRead(id: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel
      .findByIdAndUpdate(id, { is_read: true }, { new: true })
      .exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel
      .updateMany(
        { user_id: new Types.ObjectId(userId), is_read: false },
        { is_read: true },
      )
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Notification not found');
    }
  }
}
