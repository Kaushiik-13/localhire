import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressType } from '../../../../common/enums/status.enum';

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
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ enum: AddressType })
  @IsEnum(AddressType)
  @IsOptional()
  address_type?: AddressType;
}

export class UpdateProfileInputDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'https://s3.bucket.com/photo.jpg' })
  @IsString()
  @IsOptional()
  profile_photo?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ type: [AddressInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressInputDto)
  @IsOptional()
  addresses?: AddressInputDto[];
}
