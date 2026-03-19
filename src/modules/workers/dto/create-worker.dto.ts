import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { ApprovalStatus } from '../../../common/enums/approval.enum';
import {
  WorkerAvailability,
  WorkerType,
} from '../../../common/enums/status.enum';

export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @IsNumber()
  @IsOptional()
  expected_salary?: number;

  @IsEnum(WorkerAvailability)
  @IsOptional()
  availability?: WorkerAvailability;

  @IsEnum(WorkerType)
  @IsOptional()
  worker_type?: WorkerType;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  skills?: string[];
}

export class UpdateWorkerDto {
  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @IsNumber()
  @IsOptional()
  expected_salary?: number;

  @IsEnum(WorkerAvailability)
  @IsOptional()
  availability?: WorkerAvailability;

  @IsEnum(WorkerType)
  @IsOptional()
  worker_type?: WorkerType;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  skills?: string[];

  @IsEnum(ApprovalStatus)
  @IsOptional()
  approval_status?: ApprovalStatus;
}
