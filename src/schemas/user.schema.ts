import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../common/enums/roles.enum';
import { ApprovalStatus } from '../common/enums/approval.enum';
import { UserStatus } from '../common/enums/status.enum';
import { AddressType } from '../common/enums/status.enum';
import {
  DocumentType,
  DocumentVerificationStatus,
} from '../common/enums/status.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true })
  address_line1: string;

  @Prop()
  address_line2?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postal_code: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;

  @Prop({ enum: AddressType, default: AddressType.HOME })
  address_type: AddressType;
}

@Schema()
export class IdentityDoc {
  @Prop({ enum: DocumentType, required: true })
  document_type: DocumentType;

  @Prop({ required: true })
  document_number: string;

  @Prop()
  document_url?: string;

  @Prop({
    enum: DocumentVerificationStatus,
    default: DocumentVerificationStatus.PENDING,
  })
  verification_status: DocumentVerificationStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  verified_by?: Types.ObjectId;

  @Prop()
  verified_at?: Date;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop()
  profile_photo?: string;

  @Prop({ default: 'en' })
  language: string;

  @Prop({ default: false })
  is_phone_verified: boolean;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ type: [String], enum: Role, default: [] })
  roles: Role[];

  @Prop({ enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  approval_status: ApprovalStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approved_by?: Types.ObjectId;

  @Prop()
  approved_at?: Date;

  @Prop({ type: [Address], default: [] })
  addresses: Address[];

  @Prop({ type: [IdentityDoc], default: [] })
  identity_docs: IdentityDoc[];
}

export const UserSchema = SchemaFactory.createForClass(User);
