import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  ValidateNested,
  IsEmail,
  Validate,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Role } from '../../../../common/enums/roles.enum';
import { ApprovalStatus } from '../../../../common/enums/approval.enum';
import {
  UserStatus,
  AddressType,
  DocumentType,
} from '../../../../common/enums/status.enum';

function IsUserArray() {
  return Validate((value: any) => {
    return Array.isArray(value);
  });
}

export class CreateBulkAddressDto {
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

export class CreateBulkIdentityDocDto {
  @IsEnum(DocumentType)
  document_type: DocumentType;

  @IsString()
  @IsNotEmpty()
  document_number: string;

  @IsString()
  @IsOptional()
  document_url?: string;
}

export class CreateBulkUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  profile_photo?: string;

  @IsString()
  @IsOptional()
  language?: string;

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
  @ValidateNested({ each: true })
  @Type(() => CreateBulkAddressDto)
  @IsOptional()
  addresses?: CreateBulkAddressDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBulkIdentityDocDto)
  @IsOptional()
  identity_docs?: CreateBulkIdentityDocDto[];
}

export class CreateBulkUsersInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBulkUserDto)
  users: CreateBulkUserDto[];
}
