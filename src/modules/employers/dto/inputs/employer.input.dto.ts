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
  registration_number?: number;

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

export class UpdateEmployerAddressDto {
  @ApiPropertyOptional({ example: '45 Business Park' })
  @IsString()
  @IsOptional()
  address_line1?: string;

  @ApiPropertyOptional({ example: 'Block B' })
  @IsString()
  @IsOptional()
  address_line2?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '400001' })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateEmployerUserFieldsDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/photo.jpg' })
  @IsString()
  @IsOptional()
  profile_photo?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ type: () => UpdateEmployerAddressDto })
  @IsOptional()
  address?: UpdateEmployerAddressDto;
}

export class UpdateEmployerProfileInputDto {
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

  @ApiPropertyOptional({ type: () => UpdateEmployerUserFieldsDto })
  @IsOptional()
  user?: UpdateEmployerUserFieldsDto;
}
