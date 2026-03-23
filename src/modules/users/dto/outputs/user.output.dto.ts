import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../../common/enums/roles.enum';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';
import { UserStatus } from '../../../../common/enums/status.enum';
import { AddressType } from '../../../../common/enums/status.enum';

export class AddressOutputDto {
  @ApiProperty({ example: '123 Main St' })
  address_line1: string;

  @ApiPropertyOptional()
  address_line2?: string;

  @ApiProperty({ example: 'Mumbai' })
  city: string;

  @ApiProperty({ example: 'Maharashtra' })
  state: string;

  @ApiProperty({ example: '400001' })
  postal_code: string;

  @ApiProperty({ example: 'India' })
  country: string;

  @ApiPropertyOptional()
  latitude?: number;

  @ApiPropertyOptional()
  longitude?: number;

  @ApiProperty({ enum: AddressType })
  address_type: AddressType;
}

export class IdentityDocOutputDto {
  @ApiProperty({ example: 'Aadhaar' })
  document_type: string;

  @ApiProperty({ example: '123456789012' })
  document_number: string;

  @ApiPropertyOptional()
  document_url?: string;

  @ApiProperty({ example: 'pending' })
  verification_status: string;
}

export class UserOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '+1234567890' })
  phone: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  profile_photo?: string;

  @ApiProperty({ example: 'en' })
  language: string;

  @ApiProperty({ example: false })
  is_phone_verified: boolean;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];

  @ApiProperty({ enum: ApprovalStatus })
  approval_status: ApprovalStatus;

  @ApiProperty({ type: [AddressOutputDto], nullable: true })
  addresses?: AddressOutputDto[];

  @ApiProperty({ type: [IdentityDocOutputDto], nullable: true })
  identity_docs?: IdentityDocOutputDto[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
