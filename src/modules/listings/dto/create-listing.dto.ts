import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsMongoId,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class JobDetailsDto {
  @IsNumber()
  @IsOptional()
  salary_min?: number;

  @IsNumber()
  @IsOptional()
  salary_max?: number;

  @IsEnum(['full-time', 'part-time'])
  @IsOptional()
  job_type?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  required_skills?: string[];
}

class ServiceDetailsDto {
  @IsNumber()
  @IsOptional()
  price?: number;
}

class ListingAddressDto {
  @IsString()
  @IsOptional()
  address_line1?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postal_code?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}

class ListingImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['job', 'service'])
  @IsNotEmpty()
  listing_type: string;

  @IsMongoId()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsNotEmpty()
  created_by: string;

  @IsEnum(['employer', 'customer'])
  @IsNotEmpty()
  created_by_role: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ListingAddressDto)
  @IsOptional()
  address?: ListingAddressDto;

  @IsObject()
  @ValidateNested()
  @Type(() => JobDetailsDto)
  @IsOptional()
  job_details?: JobDetailsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ServiceDetailsDto)
  @IsOptional()
  service_details?: ServiceDetailsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingImageDto)
  @IsOptional()
  images?: ListingImageDto[];
}

export class UpdateListingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['job', 'service'])
  @IsOptional()
  listing_type?: string;

  @IsMongoId()
  @IsOptional()
  category_id?: string;

  @IsEnum(['active', 'closed', 'paused'])
  @IsOptional()
  status?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ListingAddressDto)
  @IsOptional()
  address?: ListingAddressDto;

  @IsObject()
  @ValidateNested()
  @Type(() => JobDetailsDto)
  @IsOptional()
  job_details?: JobDetailsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ServiceDetailsDto)
  @IsOptional()
  service_details?: ServiceDetailsDto;
}
