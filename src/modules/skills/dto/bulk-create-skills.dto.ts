import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBulkSkillDto {
  @ApiProperty({ example: 'Plumber' })
  @IsString()
  @IsNotEmpty()
  skill_name: string;
}

export class CreateBulkSkillsInputDto {
  @ApiProperty({ type: [CreateBulkSkillDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBulkSkillDto)
  skills: CreateBulkSkillDto[];
}

export class BulkCreateSkillsOutputDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  created_count: number;

  @ApiProperty()
  failed_count: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        skill_name: { type: 'string' },
        status: { type: 'string', enum: ['success', 'failed'] },
        message: { type: 'string' },
      },
    },
  })
  results: Array<{
    skill_name: string;
    status: 'success' | 'failed';
    message: string;
  }>;
}
