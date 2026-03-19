import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class CreateEmployerDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsEnum(['shop', 'restaurant'])
  @IsNotEmpty()
  business_type: string;

  @IsString()
  @IsOptional()
  business_description?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsMongoId()
  @IsOptional()
  category_id?: string;
}

export class UpdateEmployerDto {
  @IsString()
  @IsOptional()
  business_name?: string;

  @IsEnum(['shop', 'restaurant'])
  @IsOptional()
  business_type?: string;

  @IsString()
  @IsOptional()
  business_description?: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsMongoId()
  @IsOptional()
  category_id?: string;
}
