import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApprovalStatus } from '../common/enums/approval.enum';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop()
  preferred_location?: string;

  @Prop({ type: Object, default: {} })
  preferences?: Record<string, any>;

  @Prop({ enum: ApprovalStatus, default: ApprovalStatus.APPROVED })
  approval_status: ApprovalStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approved_by?: Types.ObjectId;

  @Prop()
  approved_at?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
