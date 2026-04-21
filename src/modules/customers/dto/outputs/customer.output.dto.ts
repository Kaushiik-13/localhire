import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';

class UserOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Ravi Kumar' })
  name: string;

  @ApiProperty({ example: '+919876543210' })
  phone: string;

  @ApiPropertyOptional({ example: 'ravi@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  profile_photo?: string;

  @ApiPropertyOptional({ example: 'en' })
  language?: string;

  @ApiPropertyOptional({ example: 'approved' })
  approval_status?: string;

  @ApiPropertyOptional({ type: [Object] })
  addresses?: any[];
}

export class CustomerOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439031' })
  id: string;

  @ApiProperty({ type: UserOutputDto })
  user_id: UserOutputDto | string;

  @ApiPropertyOptional({ example: 'Chennai' })
  preferred_location?: string;

  @ApiPropertyOptional({ example: { service_categories: ['electrical', 'plumbing'] } })
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ enum: ApprovalStatus })
  approval_status?: ApprovalStatus;

  @ApiProperty({ example: '2026-04-20T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-20T10:00:00.000Z' })
  updatedAt: Date;
}

export class CustomerMessageOutputDto {
  @ApiProperty({ example: 'Customer deleted successfully' })
  message: string;
}
