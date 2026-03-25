import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';
import {
  WorkerAvailability,
  WorkerType,
} from '../../../../common/enums/status.enum';

export class WorkerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  user_id: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  job_title?: string;

  @ApiPropertyOptional({ example: 'Experienced software developer...' })
  description?: string;

  @ApiPropertyOptional({ example: 3 })
  experience_years?: number;

  @ApiPropertyOptional({ example: 50000 })
  expected_salary?: number;

  @ApiPropertyOptional({ example: 50 })
  hourly_rate?: number;

  @ApiPropertyOptional({ enum: WorkerAvailability })
  availability?: WorkerAvailability;

  @ApiPropertyOptional({ enum: WorkerType })
  worker_type?: WorkerType;

  @ApiPropertyOptional({ example: 4.5 })
  rating?: number;

  @ApiPropertyOptional({ example: 10 })
  completed_jobs?: number;

  @ApiPropertyOptional({ enum: ApprovalStatus })
  approval_status?: ApprovalStatus;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  approved_by?: string;

  @ApiPropertyOptional({ example: '2024-01-15T00:00:00.000Z' })
  approved_at?: Date;

  @ApiPropertyOptional({ type: [String] })
  skills?: string[];

  @ApiPropertyOptional({ example: '2024-02-01' })
  available_from?: Date;

  @ApiPropertyOptional({ example: 'Mumbai' })
  current_location?: string;

  @ApiPropertyOptional({ example: true })
  willing_to_relocate?: boolean;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/resume.pdf' })
  resume_url?: string;

  @ApiPropertyOptional({ example: ['English', 'Hindi'] })
  languages?: string[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
