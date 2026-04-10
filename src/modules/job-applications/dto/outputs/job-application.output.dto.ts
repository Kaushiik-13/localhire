import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../../../../common/enums/status.enum';

export class ApplicantOutputDto {
  @ApiProperty({ example: '69d8981955f36031a2d09f79' })
  application_id: string;

  @ApiProperty({ example: '69ce05c8ae56c107b3abf956' })
  worker_id: string;

  @ApiProperty({ example: 'John Doe' })
  worker_name: string;

  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.APPLIED })
  status: ApplicationStatus;
}

export class ListingApplicantsOutputDto {
  @ApiProperty({ example: '69d893bb05ec8bea742c5968' })
  listing_id: string;

  @ApiProperty({ type: [ApplicantOutputDto] })
  applicants: ApplicantOutputDto[];
}

class JobApplicationListingOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Software Engineer Position' })
  title: string;

  @ApiProperty({ example: 'job' })
  listing_type: string;
}

class JobApplicationWorkerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}

class JobApplicationEmployerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  id: string;

  @ApiProperty({ example: 'Acme Corp' })
  name: string;
}

export class JobApplicationOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439010' })
  id: string;

  @ApiProperty({ type: JobApplicationListingOutputDto })
  listing_id: JobApplicationListingOutputDto;

  @ApiProperty({ type: JobApplicationWorkerOutputDto })
  worker_id: JobApplicationWorkerOutputDto;

  @ApiProperty({ type: JobApplicationEmployerOutputDto })
  employer_id: JobApplicationEmployerOutputDto;

  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.APPLIED })
  status: ApplicationStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  applied_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

class WorkerApplicationOutputDto {
  @ApiProperty({ example: '69d8a3a78d5db95d46ff42bb' })
  id: string;

  @ApiProperty({ type: Object })
  listing_id: Record<string, any>;

  @ApiProperty({ example: '69d0ff5e2edf32b2239f3901' })
  worker_id: string;

  @ApiProperty({
    example: '69ce06a3ae56c107b3abf982',
    required: false,
    nullable: true,
  })
  employer_id: Record<string, any> | null;

  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.APPLIED })
  status: ApplicationStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  applied_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class WorkerApplicationsListOutputDto {
  @ApiProperty({ example: 2 })
  count: number;

  @ApiProperty({ type: [WorkerApplicationOutputDto] })
  applications: WorkerApplicationOutputDto[];
}

export class ApplicationStatusUpdateOutputDto {
  @ApiProperty({ example: '69d8981955f36031a2d09f79' })
  id: string;

  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.ACCEPTED })
  status: ApplicationStatus;

  @ApiProperty({ example: 'Application status updated successfully' })
  message: string;
}

export class DeleteAllOutputDto {
  @ApiProperty({ example: 'All job applications deleted successfully' })
  message: string;

  @ApiProperty({ example: 5 })
  deletedCount: number;
}
