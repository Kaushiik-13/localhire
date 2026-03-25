import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';

export class EmployerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  user_id: string;

  @ApiProperty({ example: 'ABC Plumbing Services' })
  business_name: string;

  @ApiProperty({ enum: ['shop', 'restaurant'] })
  business_type: string;

  @ApiPropertyOptional({ example: 'We provide plumbing services...' })
  business_description?: string;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/logo.png' })
  logo_url?: string;

  @ApiPropertyOptional({ example: 'ABC123456789' })
  registration_number?: string;

  @ApiPropertyOptional({ example: 2010 })
  established_year?: number;

  @ApiPropertyOptional({ example: '9:00 AM - 6:00 PM' })
  operating_hours?: string;

  @ApiPropertyOptional({ enum: ApprovalStatus })
  approval_status?: ApprovalStatus;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  approved_by?: string;

  @ApiPropertyOptional({ example: '2024-01-15T00:00:00.000Z' })
  approved_at?: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
