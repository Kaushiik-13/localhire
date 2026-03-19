import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsMongoId,
} from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  skill_name: string;

  @IsEnum(['service', 'job'])
  @IsNotEmpty()
  category: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsOptional()
  created_by?: string;
}

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  skill_name?: string;

  @IsEnum(['service', 'job'])
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
