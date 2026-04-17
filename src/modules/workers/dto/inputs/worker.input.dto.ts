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
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';
import {
  WorkerAvailability,
  WorkerType,
} from '../../../../common/enums/status.enum';

export class CreateWorkerInputDto {
  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  job_title?: string;

  @ApiPropertyOptional({ example: 'Experienced software developer...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @IsOptional()
  expected_salary?: number;

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

export class UpdateWorkerInputDto {
  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  job_title?: string;

  @ApiPropertyOptional({ example: 'Experienced software developer...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @IsOptional()
  expected_salary?: number;

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

export class UpdateWorkerAddressDto {
  @ApiPropertyOptional({ example: '45 Gandhi Nagar' })
  @IsString()
  @IsOptional()
  address_line1?: string;

  @ApiPropertyOptional({ example: 'Block B' })
  @IsString()
  @IsOptional()
  address_line2?: string;

  @ApiPropertyOptional({ example: 'Delhi' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Delhi' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '110031' })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateWorkerUserFieldsDto {
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

  @ApiPropertyOptional({ type: () => UpdateWorkerAddressDto })
  @IsOptional()
  address?: UpdateWorkerAddressDto;
}

export class UpdateWorkerProfileInputDto {
  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  job_title?: string;

  @ApiPropertyOptional({ example: 'Experienced software developer...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @IsOptional()
  expected_salary?: number;

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

  @ApiPropertyOptional({ type: () => UpdateWorkerUserFieldsDto })
  @IsOptional()
  user?: UpdateWorkerUserFieldsDto;
}
