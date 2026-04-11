import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApprovalStatus } from '../common/enums/approval.enum';
import { ListingStatus, WorkerAvailability } from '../common/enums/status.enum';

export type ListingDocument = Listing & Document;

@Schema()
export class ListingAddress {
  @Prop()
  address_line1?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  postal_code?: string;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;
}

@Schema()
export class JobDetails {
  @Prop()
  salary_min?: number;

  @Prop()
  salary_max?: number;

  @Prop({ enum: WorkerAvailability })
  job_type?: WorkerAvailability;

  @Prop()
  start_date?: Date;

  @Prop()
  end_date?: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Skill' }], default: [] })
  required_skills: Types.ObjectId[];
}

@Schema()
export class ServiceDetails {
  @Prop()
  price?: number;
}

@Schema()
export class ListingImage {
  @Prop({ required: true })
  url: string;

  @Prop()
  order?: number;
}

@Schema()
export class AcceptedWorker {
  @Prop({ type: Types.ObjectId, ref: 'Worker' })
  worker_id: Types.ObjectId;

  @Prop()
  worker_name: string;

  @Prop({ type: Types.ObjectId })
  application_id: Types.ObjectId;

  @Prop()
  status: string;

  @Prop()
  accepted_at: Date;
}

@Schema({ timestamps: true })
export class Listing {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['job', 'service'], required: true })
  listing_type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  created_by: Types.ObjectId;

  @Prop({ enum: ['employer', 'customer'], required: true })
  created_by_role: string;

  @Prop({ enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  approval_status: ApprovalStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approved_by?: Types.ObjectId;

  @Prop()
  approved_at?: Date;

  @Prop({ enum: ListingStatus, default: ListingStatus.ACTIVE })
  status: ListingStatus;

  @Prop({ type: ListingAddress })
  address?: ListingAddress;

  @Prop({ type: JobDetails })
  job_details?: JobDetails;

  @Prop({ type: ServiceDetails })
  service_details?: ServiceDetails;

  @Prop({ type: [ListingImage], default: [] })
  images: ListingImage[];

  @Prop({ type: AcceptedWorker })
  accepted_worker?: AcceptedWorker;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
