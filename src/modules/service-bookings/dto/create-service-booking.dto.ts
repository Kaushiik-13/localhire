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

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'The ID of the service provider',
  })
  @IsString()
  @IsNotEmpty()
  service_provider_id: string;
}

export class UpdateServiceBookingDto {
  @ApiPropertyOptional({
    example: 'confirmed',
    description: 'The status to update to',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
  })
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
  @IsOptional()
  status?: string;
}

export class UpdateServiceBookingStatusDto {
  @ApiProperty({
    example: 'confirmed',
    description: 'The status to update to',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
  })
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
  status: string;
}
