import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';
import { ListingStatus } from '../../../../common/enums/status.enum';

class ListingAddressOutputDto {
  @ApiPropertyOptional({ example: '123 Main Street' })
  address_line1?: string;

  @ApiPropertyOptional({ example: 'New York' })
  city?: string;

  @ApiPropertyOptional({ example: 'NY' })
  state?: string;

  @ApiPropertyOptional({ example: '10001' })
  postal_code?: string;

  @ApiPropertyOptional({ example: 40.7128 })
  latitude?: number;

  @ApiPropertyOptional({ example: -74.006 })
  longitude?: number;
}

class JobDetailsOutputDto {
  @ApiPropertyOptional({ example: 30000 })
  salary_min?: number;

  @ApiPropertyOptional({ example: 50000 })
  salary_max?: number;

  @ApiPropertyOptional({ example: 'full-time' })
  job_type?: string;

  @ApiPropertyOptional({ example: ['507f1f77bcf86cd799439011'] })
  required_skills?: string[];

  @ApiPropertyOptional({ example: 'Monday - Friday' })
  working_days?: string;

  @ApiPropertyOptional({ example: "Bachelor's degree, 2+ years experience" })
  eligible_criteria?: string;

  @ApiPropertyOptional({ example: 2 })
  experience?: number;
}

class ServiceDetailsOutputDto {
  @ApiPropertyOptional({ example: 500 })
  price?: number;
}

class ListingImageOutputDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  url: string;

  @ApiPropertyOptional({ example: 1 })
  order?: number;
}

export class ListingOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Software Engineer Position' })
  title: string;

  @ApiPropertyOptional({
    example: 'We are looking for a skilled software engineer...',
  })
  description?: string;

  @ApiProperty({ enum: ['job', 'service'], example: 'job' })
  listing_type: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  created_by?: string;

  @ApiProperty({ enum: ['employer', 'customer', 'service_provider', 'worker'], example: 'employer' })
  created_by_role: string;

  @ApiProperty({ enum: ApprovalStatus, example: ApprovalStatus.PENDING })
  approval_status: ApprovalStatus;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  approved_by?: string;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  approved_at?: Date;

  @ApiProperty({ enum: ListingStatus, example: ListingStatus.ACTIVE })
  status: ListingStatus;

  @ApiPropertyOptional({ type: ListingAddressOutputDto })
  address?: ListingAddressOutputDto;

  @ApiPropertyOptional({ type: JobDetailsOutputDto })
  job_details?: JobDetailsOutputDto;

  @ApiPropertyOptional({ type: ServiceDetailsOutputDto })
  service_details?: ServiceDetailsOutputDto;

  @ApiPropertyOptional({ type: [ListingImageOutputDto] })
  images?: ListingImageOutputDto[];

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  createdAt?: Date;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt?: Date;
}

export class ListingListOutputDto {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiPropertyOptional({ type: [ListingOutputDto] })
  listings?: ListingOutputDto[];
}

export class ListingMessageOutputDto {
  @ApiProperty({ example: 'Listing created successfully' })
  message: string;

  @ApiPropertyOptional({ type: ListingOutputDto })
  listing?: ListingOutputDto;
}
