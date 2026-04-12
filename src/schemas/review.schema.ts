import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reviewer_id: Types.ObjectId;

  @Prop({ enum: ['service', 'job'], required: true })
  review_type: string;

  @Prop({ type: Types.ObjectId, ref: 'JobApplication' })
  job_application_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Worker' })
  worker_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employer' })
  employer_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ServiceBooking' })
  booking_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ServiceProvider' })
  service_provider_id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  customer_id?: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
