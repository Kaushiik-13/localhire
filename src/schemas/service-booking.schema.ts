import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../common/enums/status.enum';

export type ServiceBookingDocument = ServiceBooking & Document;

@Schema({ timestamps: true })
export class ServiceBooking {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the listing',
  })
  @Prop({ type: Types.ObjectId, ref: 'Listing', required: true })
  listing_id: Types.ObjectId;

  @ApiProperty({
    example: '507f1f77bcf86cd799439013',
    description: 'The ID of the customer (auto-fetched from listing)',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customer_id: Types.ObjectId;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'The ID of the service provider',
  })
  @Prop({ type: Types.ObjectId, ref: 'ServiceProvider', required: true })
  service_provider_id: Types.ObjectId;

  @ApiProperty({
    example: 'pending',
    description: 'The status of the booking',
    enum: BookingStatus,
    default: 'pending',
  })
  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
}

export const ServiceBookingSchema =
  SchemaFactory.createForClass(ServiceBooking);
