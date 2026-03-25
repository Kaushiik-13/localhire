import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsMongoId,
  IsBoolean,
  IsDate,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';
import {
  WorkerAvailability,
  WorkerType,
} from '../../../../common/enums/status.enum';

export class CreateWorkerInputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  user_id: string;

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
