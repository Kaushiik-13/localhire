import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';

export class CreateEmployerInputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'ABC Plumbing Services' })
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @ApiProperty({ enum: ['shop', 'restaurant'] })
  @IsEnum(['shop', 'restaurant'])
  business_type: string;

  @ApiPropertyOptional({ example: 'We provide plumbing services...' })
  @IsString()
  @IsOptional()
  business_description?: string;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/logo.png' })
  @IsString()
  @IsOptional()
  logo_url?: string;

  @ApiPropertyOptional({ example: 'ABC123456789' })
  @IsString()
  @IsOptional()
  registration_number?: string;

  @ApiPropertyOptional({ example: 2010 })
  @IsNumber()
  @IsOptional()
  established_year?: number;

  @ApiPropertyOptional({ example: '9:00 AM - 6:00 PM' })
  @IsString()
  @IsOptional()
  operating_hours?: string;
}

export class UpdateEmployerInputDto {
  @ApiPropertyOptional({ example: 'ABC Plumbing Services' })
  @IsString()
  @IsOptional()
  business_name?: string;

  @ApiPropertyOptional({ enum: ['shop', 'restaurant'] })
  @IsEnum(['shop', 'restaurant'])
  @IsOptional()
  business_type?: string;

  @ApiPropertyOptional({ example: 'We provide plumbing services...' })
  @IsString()
  @IsOptional()
  business_description?: string;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/logo.png' })
  @IsString()
  @IsOptional()
  logo_url?: string;

  @ApiPropertyOptional({ example: 'ABC123456789' })
  @IsString()
  @IsOptional()
  registration_number?: string;

  @ApiPropertyOptional({ example: 2010 })
  @IsNumber()
  @IsOptional()
  established_year?: number;

  @ApiPropertyOptional({ example: '9:00 AM - 6:00 PM' })
  @IsString()
  @IsOptional()
  operating_hours?: string;

  @ApiPropertyOptional({ enum: ApprovalStatus })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  approval_status?: ApprovalStatus;
}
