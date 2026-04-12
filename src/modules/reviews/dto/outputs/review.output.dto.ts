import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ReviewerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439010' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}

class WorkerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Jane Smith' })
  name: string;
}

class EmployerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  id: string;

  @ApiProperty({ example: 'Acme Corp' })
  business_name: string;
}

class ServiceProviderOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  id: string;

  @ApiProperty({ example: 'Bob Fix' })
  name: string;
}

class CustomerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439014' })
  id: string;

  @ApiProperty({ example: 'Alice' })
  name: string;
}

export class ReviewOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439099' })
  id: string;

  @ApiProperty({ type: ReviewerOutputDto })
  reviewer_id: ReviewerOutputDto;

  @ApiProperty({ example: 'job' })
  review_type: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  job_application_id?: string;

  @ApiPropertyOptional({ type: WorkerOutputDto })
  worker_id?: WorkerOutputDto;

  @ApiPropertyOptional({ type: EmployerOutputDto })
  employer_id?: EmployerOutputDto;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439012' })
  booking_id?: string;

  @ApiPropertyOptional({ type: ServiceProviderOutputDto })
  service_provider_id?: ServiceProviderOutputDto;

  @ApiPropertyOptional({ type: CustomerOutputDto })
  customer_id?: CustomerOutputDto;

  @ApiProperty({ example: 4 })
  rating: number;

  @ApiPropertyOptional({ example: 'Great work!' })
  comment?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class ReviewListOutputDto {
  @ApiProperty({ example: 5 })
  count: number;

  @ApiProperty({ type: [ReviewOutputDto] })
  reviews: ReviewOutputDto[];
}

export class ReviewMessageOutputDto {
  @ApiProperty({ example: 'Review deleted successfully' })
  message: string;
}
