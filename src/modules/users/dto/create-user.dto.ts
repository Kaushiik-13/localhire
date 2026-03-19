import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsDate,
} from 'class-validator';
import { Role } from '../../../common/enums/roles.enum';
import { ApprovalStatus } from '../../../common/enums/approval.enum';
import {
  UserStatus,
  AddressType,
  DocumentType,
  DocumentVerificationStatus,
} from '../../../common/enums/status.enum';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  address_line1: string;

  @IsString()
  @IsOptional()
  address_line2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsEnum(AddressType)
  @IsOptional()
  address_type?: AddressType;
}

export class CreateIdentityDocDto {
  @IsEnum(DocumentType)
  document_type: DocumentType;

  @IsString()
  @IsNotEmpty()
  document_number: string;

  @IsString()
  @IsOptional()
  document_url?: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @IsString()
  @IsOptional()
  profile_photo?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsBoolean()
  @IsOptional()
  is_phone_verified?: boolean;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsArray()
  @IsEnum(Role, { each: true })
  @IsOptional()
  roles?: Role[];

  @IsEnum(ApprovalStatus)
  @IsOptional()
  approval_status?: ApprovalStatus;

  @IsArray()
  @IsOptional()
  addresses?: CreateAddressDto[];

  @IsArray()
  @IsOptional()
  identity_docs?: CreateIdentityDocDto[];
}
