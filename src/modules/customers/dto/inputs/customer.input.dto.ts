import {
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';

export class CreateCustomerInputDto {
  @ApiPropertyOptional({ example: 'Chennai' })
  @IsString()
  @IsOptional()
  preferred_location?: string;

  @ApiPropertyOptional({
    example: { service_categories: ['electrical', 'plumbing'] },
  })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;
}

export class UpdateCustomerInputDto {
  @ApiPropertyOptional({ example: 'Bangalore' })
  @IsString()
  @IsOptional()
  preferred_location?: string;

  @ApiPropertyOptional({
    example: { service_categories: ['plumbing', 'cleaning'] },
  })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ enum: ApprovalStatus })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  approval_status?: ApprovalStatus;
}

export class UpdateCustomerUserFieldsDto {
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
}

export class UpdateCustomerProfileInputDto {
  @ApiPropertyOptional({ example: 'Bangalore' })
  @IsString()
  @IsOptional()
  preferred_location?: string;

  @ApiPropertyOptional({
    example: { service_categories: ['plumbing', 'cleaning'] },
  })
  @IsObject()
  @IsOptional()
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ type: () => UpdateCustomerUserFieldsDto })
  @IsOptional()
  user?: UpdateCustomerUserFieldsDto;
}
