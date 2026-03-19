import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsBoolean,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum([
    'booking_update',
    'application_update',
    'kyc_status',
    'approval_update',
  ])
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  reference_id?: string;

  @IsEnum(['job_application', 'service_booking', 'listing', 'user', 'worker'])
  @IsOptional()
  reference_type?: string;
}
