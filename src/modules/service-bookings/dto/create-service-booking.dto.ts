import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceBookingDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the listing to apply for',
  })
  @IsString()
  @IsNotEmpty()
  listing_id: string;

  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439012',
    description: 'The ID of the service provider (optional, inferred from JWT if not provided)',
  })
  @IsString()
  @IsOptional()
  service_provider_id?: string;
}

export class UpdateServiceBookingDto {
  @ApiPropertyOptional({
    example: 'accepted',
    description: 'The status to update to',
    enum: ['applied', 'accepted', 'rejected'],
  })
  @IsEnum(['applied', 'accepted', 'rejected'])
  @IsOptional()
  status?: string;
}

export class UpdateServiceBookingStatusDto {
  @ApiProperty({
    example: 'accepted',
    description: 'The status to update to',
    enum: ['applied', 'accepted', 'rejected'],
  })
  @IsEnum(['applied', 'accepted', 'rejected'])
  status: string;
}
