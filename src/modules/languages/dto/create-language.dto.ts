import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLanguageDto {
  @ApiProperty({ example: 'English' })
  @IsString()
  @IsNotEmpty()
  language_name: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateLanguageDto {
  @ApiPropertyOptional({ example: 'Spanish' })
  @IsString()
  @IsOptional()
  language_name?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
