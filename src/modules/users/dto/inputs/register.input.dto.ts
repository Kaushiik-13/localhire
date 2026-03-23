import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../../../common/enums/roles.enum';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';
import { UserStatus } from '../../../../common/enums/status.enum';
import { AddressType } from '../../../../common/enums/status.enum';
import { DocumentType } from '../../../../common/enums/status.enum';

export class AddressInputDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address_line1: string;

  @ApiPropertyOptional({ example: 'Apt 4' })
  @IsString()
  @IsOptional()
  address_line2?: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Maharashtra' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '400001' })
  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ enum: AddressType })
  @IsEnum(AddressType)
  @IsOptional()
  address_type?: AddressType;
}

export class IdentityDocInputDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  document_type: DocumentType;

  @ApiProperty({ example: '123456789012' })
  @IsString()
  @IsNotEmpty()
  document_number: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  document_url?: string;
}

export class RegisterInputDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/photo.jpg' })
  @IsString()
  @IsOptional()
  profile_photo?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({ enum: Role, isArray: true })
  @IsArray()
  @IsEnum(Role, { each: true })
  @IsOptional()
  roles?: Role[];

  @ApiPropertyOptional({ enum: ApprovalStatus })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  approval_status?: ApprovalStatus;

  @ApiPropertyOptional({ type: [AddressInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressInputDto)
  @IsOptional()
  addresses?: AddressInputDto[];

  @ApiPropertyOptional({ type: [IdentityDocInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdentityDocInputDto)
  @IsOptional()
  identity_docs?: IdentityDocInputDto[];
}
