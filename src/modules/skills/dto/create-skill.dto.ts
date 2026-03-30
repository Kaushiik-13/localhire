import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ example: 'JavaScript' })
  @IsString()
  @IsNotEmpty()
  skill_name: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  created_by?: string;
}

export class UpdateSkillDto {
  @ApiPropertyOptional({ example: 'TypeScript' })
  @IsString()
  @IsOptional()
  skill_name?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
