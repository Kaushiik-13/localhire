import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  reviewer_id: string;

  @IsString()
  @IsNotEmpty()
  worker_id: string;

  @IsEnum(['service', 'job'])
  @IsNotEmpty()
  review_type: string;

  @IsString()
  @IsOptional()
  booking_id?: string;

  @IsString()
  @IsOptional()
  job_application_id?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
