import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../../../../common/enums/status.enum';

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

export class JobApplicationListOutputDto {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiPropertyOptional({ type: [JobApplicationOutputDto] })
  applications?: JobApplicationOutputDto[];
}

export class JobApplicationMessageOutputDto {
  @ApiProperty({ example: 'Job application created successfully' })
  message: string;
}
