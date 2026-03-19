import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingStatus } from '../common/enums/status.enum';

export type ServiceBookingDocument = ServiceBooking & Document;

@Schema({ timestamps: true })
export class ServiceBooking {
  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listing_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customer_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ServiceProvider', required: true })
  service_provider_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employer' })
  employer_id?: Types.ObjectId;

  @Prop({ required: true })
  booking_date: Date;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
}

export const ServiceBookingSchema =
  SchemaFactory.createForClass(ServiceBooking);
