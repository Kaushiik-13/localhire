import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    enum: [
      'booking_update',
      'application_update',
      'kyc_status',
      'approval_update',
    ],
    required: true,
  })
  type: string;

  @Prop({ type: Types.ObjectId })
  reference_id?: Types.ObjectId;

  @Prop({
    enum: ['job_application', 'service_booking', 'listing', 'user', 'worker'],
  })
  reference_type?: string;

  @Prop({ default: false })
  is_read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
