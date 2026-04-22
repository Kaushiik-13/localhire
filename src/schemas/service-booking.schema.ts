import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../common/enums/status.enum';

export type ServiceBookingDocument = ServiceBooking & Document;

@Schema({ timestamps: true })
export class ServiceBooking {
  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the listing (optional for direct bookings)',
  })
  @Prop({ type: Types.ObjectId, ref: 'Listing', required: false })
  listing_id?: Types.ObjectId;

  @ApiProperty({
    example: '507f1f77bcf86cd799439013',
    description: 'The ID of the customer',
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
    example: 'applied',
    description: 'The status of the booking',
    enum: ApplicationStatus,
    default: 'applied',
  })
  @Prop({ enum: ApplicationStatus, default: ApplicationStatus.APPLIED })
  status: ApplicationStatus;

  @ApiProperty({
    example: 'listing',
    description: 'Type of booking: listing-based or direct',
    enum: ['listing', 'direct'],
    default: 'listing',
  })
  @Prop({ enum: ['listing', 'direct'], default: 'listing' })
  booking_type: 'listing' | 'direct';

  @ApiPropertyOptional({
    example: 'plumbing',
    description: 'Category of service (for direct bookings)',
  })
  @Prop({ type: String })
  service_category?: string;

  @ApiPropertyOptional({
    example: 'Need a faucet fixed',
    description: 'Description of the service needed',
  })
  @Prop({ type: String })
  description?: string;

  @ApiPropertyOptional({
    description: 'Address where service is needed',
  })
  @Prop({
    type: {
      address_line1: String,
      city: String,
      state: String,
      postal_code: String,
      latitude: Number,
      longitude: Number,
    },
  })
  address?: {
    address_line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
  };

  @ApiPropertyOptional({
    example: '2025-06-15T10:00:00.000Z',
    description: 'Preferred date for the service',
  })
  @Prop({ type: Date })
  preferred_date?: Date;

  @ApiPropertyOptional({
    example: 150,
    description: 'Budget for the service',
  })
  @Prop({ type: Number })
  budget?: number;
}

export const ServiceBookingSchema =
  SchemaFactory.createForClass(ServiceBooking);
