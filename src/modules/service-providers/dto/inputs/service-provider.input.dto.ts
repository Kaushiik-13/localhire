import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsMongoId,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';
import {
  WorkerAvailability,
  WorkerType,
} from '../../../../common/enums/status.enum';

export class CreateServiceProviderInputDto {
  @ApiPropertyOptional({ example: 'Plumber' })
  @IsString()
  @IsOptional()
  job_title?: string;

  @ApiPropertyOptional({ example: 'Experienced plumber...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @IsOptional()
  expected_price?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  hourly_rate?: number;

  @ApiPropertyOptional({ enum: WorkerAvailability })
  @IsEnum(WorkerAvailability)
  @IsOptional()
  availability?: WorkerAvailability;

  @ApiPropertyOptional({ enum: WorkerType })
  @IsEnum(WorkerType)
  @IsOptional()
  worker_type?: WorkerType;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiPropertyOptional({ example: '2024-02-01' })
  @IsDateString()
  @IsOptional()
  available_from?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsString()
  @IsOptional()
  current_location?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  willing_to_relocate?: boolean;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/resume.pdf' })
  @IsString()
  @IsOptional()
  resume_url?: string;

  @ApiPropertyOptional({ example: ['English', 'Hindi'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];
}

export class UpdateServiceProviderInputDto {
  @ApiPropertyOptional({ example: 'Plumber' })
  @IsString()
  @IsOptional()
  job_title?: string;

  @ApiPropertyOptional({ example: 'Experienced plumber...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @IsOptional()
  expected_price?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  hourly_rate?: number;

  @ApiPropertyOptional({ enum: WorkerAvailability })
  @IsEnum(WorkerAvailability)
  @IsOptional()
  availability?: WorkerAvailability;

  @ApiPropertyOptional({ enum: WorkerType })
  @IsEnum(WorkerType)
  @IsOptional()
  worker_type?: WorkerType;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiPropertyOptional({ example: '2024-02-01' })
  @IsDateString()
  @IsOptional()
  available_from?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsString()
  @IsOptional()
  current_location?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  willing_to_relocate?: boolean;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/resume.pdf' })
  @IsString()
  @IsOptional()
  resume_url?: string;

  @ApiPropertyOptional({ example: ['English', 'Hindi'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional({ enum: ApprovalStatus })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  approval_status?: ApprovalStatus;
}
