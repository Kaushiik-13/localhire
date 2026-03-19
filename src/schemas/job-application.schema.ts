import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicationStatus } from '../common/enums/status.enum';

export type JobApplicationDocument = JobApplication & Document;

@Schema({ timestamps: true })
export class JobApplication {
  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listing_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Worker', required: true })
  worker_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employer', required: true })
  employer_id: Types.ObjectId;

  @Prop({ enum: ApplicationStatus, default: ApplicationStatus.APPLIED })
  status: ApplicationStatus;

  @Prop()
  applied_at?: Date;
}

export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);
