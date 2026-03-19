import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsDate,
} from 'class-validator';

export class CreateServiceBookingDto {
  @IsString()
  @IsNotEmpty()
  listing_id: string;

  @IsString()
  @IsNotEmpty()
  customer_id: string;

  @IsString()
  @IsNotEmpty()
  worker_id: string;

  @IsString()
  @IsOptional()
  employer_id?: string;

  @IsDate()
  @IsNotEmpty()
  booking_date: Date;
}

export class UpdateServiceBookingDto {
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
  @IsOptional()
  status?: string;
}
