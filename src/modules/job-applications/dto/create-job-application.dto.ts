import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsDate,
} from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  @IsNotEmpty()
  listing_id: string;

  @IsString()
  @IsNotEmpty()
  worker_id: string;

  @IsString()
  @IsNotEmpty()
  employer_id: string;
}

export class UpdateJobApplicationDto {
  @IsEnum(['applied', 'accepted', 'rejected', 'withdrawn'])
  @IsOptional()
  status?: string;
}
