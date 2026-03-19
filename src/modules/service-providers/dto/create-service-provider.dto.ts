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
import { WorkerAvailability } from '../../../common/enums/status.enum';

export class CreateServiceProviderDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @IsNumber()
  @IsOptional()
  expected_price?: number;

  @IsEnum(WorkerAvailability)
  @IsOptional()
  availability?: WorkerAvailability;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  skills?: string[];
}

export class UpdateServiceProviderDto {
  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @IsNumber()
  @IsOptional()
  expected_price?: number;

  @IsEnum(WorkerAvailability)
  @IsOptional()
  availability?: WorkerAvailability;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  skills?: string[];

  @IsEnum(ApprovalStatus)
  @IsOptional()
  approval_status?: ApprovalStatus;
}
