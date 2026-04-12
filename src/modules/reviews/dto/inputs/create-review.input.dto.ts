import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewInputDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The job application ID being reviewed',
  })
  @IsString()
  @IsNotEmpty()
  job_application_id: string;

  @ApiProperty({ example: 4, description: 'Rating from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiPropertyOptional({
    example: 'Great work!',
    description: 'Optional comment',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
