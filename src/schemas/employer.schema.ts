import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApprovalStatus } from '../common/enums/approval.enum';

export type EmployerDocument = Employer & Document;

@Schema({ timestamps: true })
export class Employer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  business_name: string;

  @Prop({ enum: ['shop', 'restaurant'], required: true })
  business_type: string;

  @Prop()
  business_description?: string;

  @Prop()
  logo_url?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category_id?: Types.ObjectId;

  @Prop({ enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  approval_status: ApprovalStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approved_by?: Types.ObjectId;

  @Prop()
  approved_at?: Date;
}

export const EmployerSchema = SchemaFactory.createForClass(Employer);
