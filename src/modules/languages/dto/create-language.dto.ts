import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  language_name: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateLanguageDto {
  @IsString()
  @IsOptional()
  language_name?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
