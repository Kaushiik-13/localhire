import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, ValidateNested, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

class DirectBookingAddressDto {
  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsString()
  @IsOptional()
  address_line1?: string;

  @ApiPropertyOptional({ example: 'New York' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'NY' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '10001' })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiPropertyOptional({ example: 40.7128 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: -74.006 })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class CreateDirectBookingDto {
  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the listing (optional for direct bookings)',
  })
  @IsOptional()
  @IsMongoId()
  listing_id?: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'The ID of the service provider to book',
  })
  @IsMongoId()
  @IsNotEmpty()
  service_provider_id: string;

  @ApiPropertyOptional({
    example: 'plumbing',
    description: 'Category of service requested',
  })
  @IsOptional()
  @IsString()
  service_category?: string;

  @ApiPropertyOptional({
    example: 'Need a faucet fixed in the kitchen',
    description: 'Description of the service needed',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Address where service is needed',
    type: DirectBookingAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DirectBookingAddressDto)
  address?: DirectBookingAddressDto;

  @ApiPropertyOptional({
    example: '2025-06-15T10:00:00.000Z',
    description: 'Preferred date for the service',
  })
  @IsOptional()
  @IsString()
  preferred_date?: string;

  @ApiPropertyOptional({
    example: 150,
    description: 'Budget for the service',
  })
  @IsOptional()
  @IsNumber()
  budget?: number;
}

export class UpdateServiceBookingDto {
  @ApiPropertyOptional({
    example: 'accepted',
    description: 'The status to update to',
    enum: ['applied', 'accepted', 'rejected', 'completed'],
  })
  @IsEnum(['applied', 'accepted', 'rejected', 'completed'])
  @IsOptional()
  status?: string;
}

export class UpdateServiceBookingStatusDto {
  @ApiProperty({
    example: 'accepted',
    description: 'The status to update to',
    enum: ['applied', 'accepted', 'rejected', 'completed'],
  })
  @IsEnum(['applied', 'accepted', 'rejected', 'completed'])
  status: string;
}
