import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class JobDetailsInputDto {
  @ApiPropertyOptional({ example: 30000 })
  @IsNumber()
  @IsOptional()
  salary_min?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @IsOptional()
  salary_max?: number;

  @ApiPropertyOptional({
    enum: ['full-time', 'part-time'],
    example: 'full-time',
  })
  @IsEnum(['full-time', 'part-time'])
  @IsOptional()
  job_type?: string;

  @ApiPropertyOptional({ example: ['507f1f77bcf86cd799439011'] })
  @IsArray()
  @IsOptional()
  required_skills?: string[];
}

class ServiceDetailsInputDto {
  @ApiPropertyOptional({ example: 500 })
  @IsNumber()
  @IsOptional()
  price?: number;
}

class ListingAddressInputDto {
  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsString()
  @IsOptional()
  address_line1?: string;

  @ApiPropertyOptional({ example: 'New York' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'NY' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '10001' })
  @IsString()
  @IsOptional()
  postal_code?: string;

  @ApiPropertyOptional({ example: 40.7128 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: -74.006 })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

class ListingImageInputDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateListingInputDto {
  @ApiProperty({ example: 'Software Engineer Position' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'We are looking for a skilled software engineer...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ['job', 'service'], example: 'job' })
  @IsEnum(['job', 'service'])
  @IsNotEmpty()
  listing_type: string;

  @ApiPropertyOptional({
    example: {
      address_line1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      latitude: 40.7128,
      longitude: -74.006,
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ListingAddressInputDto)
  @IsOptional()
  address?: ListingAddressInputDto;

  @ApiPropertyOptional({
    example: {
      salary_min: 30000,
      salary_max: 50000,
      job_type: 'full-time',
      required_skills: ['507f1f77bcf86cd799439011'],
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => JobDetailsInputDto)
  @IsOptional()
  job_details?: JobDetailsInputDto;

  @ApiPropertyOptional({ example: { price: 500 } })
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceDetailsInputDto)
  @IsOptional()
  service_details?: ServiceDetailsInputDto;

  @ApiPropertyOptional({
    example: [
      { url: 'https://example.com/image1.jpg', order: 1 },
      { url: 'https://example.com/image2.jpg', order: 2 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingImageInputDto)
  @IsOptional()
  images?: ListingImageInputDto[];
}

export class UpdateListingInputDto {
  @ApiPropertyOptional({ example: 'Software Engineer Position' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'We are looking for a skilled software engineer...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ['job', 'service'], example: 'job' })
  @IsEnum(['job', 'service'])
  @IsOptional()
  listing_type?: string;

  @ApiPropertyOptional({
    enum: ['active', 'closed', 'paused'],
    example: 'active',
  })
  @IsEnum(['active', 'closed', 'paused'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    example: {
      address_line1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      latitude: 40.7128,
      longitude: -74.006,
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ListingAddressInputDto)
  @IsOptional()
  address?: ListingAddressInputDto;

  @ApiPropertyOptional({
    example: {
      salary_min: 30000,
      salary_max: 50000,
      job_type: 'full-time',
      required_skills: ['507f1f77bcf86cd799439011'],
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => JobDetailsInputDto)
  @IsOptional()
  job_details?: JobDetailsInputDto;

  @ApiPropertyOptional({ example: { price: 500 } })
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceDetailsInputDto)
  @IsOptional()
  service_details?: ServiceDetailsInputDto;
}
