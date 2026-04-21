import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApprovalStatus } from '../common/enums/approval.enum';
import { WorkerAvailability } from '../common/enums/status.enum';

export type ServiceProviderDocument = ServiceProvider & Document;

@Schema({ timestamps: true })
export class ServiceProvider {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ default: 0 })
  experience_years: number;

  @Prop()
  expected_price?: number;

  @Prop({ enum: WorkerAvailability })
  availability?: WorkerAvailability;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  completed_services: number;

  @Prop({ default: 0 })
  completed_jobs: number;

  @Prop({ enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  approval_status: ApprovalStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approved_by?: Types.ObjectId;

  @Prop()
  approved_at?: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Skill' }], default: [] })
  skills: Types.ObjectId[];

  @Prop({ type: String })
  description?: string;

  @Prop()
  bio?: string;

  @Prop()
  job_title?: string;

  @Prop()
  hourly_rate?: number;

  @Prop()
  available_from?: Date;

  @Prop()
  current_location?: string;

  @Prop({ default: false })
  willing_to_relocate: boolean;

  @Prop()
  resume_url?: string;

  @Prop({ type: [String], default: [] })
  portfolio_urls: string[];

  @Prop({ type: [String], default: [] })
  languages: string[];
}

export const ServiceProviderSchema =
  SchemaFactory.createForClass(ServiceProvider);
