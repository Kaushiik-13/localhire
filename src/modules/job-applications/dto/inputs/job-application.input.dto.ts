import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobApplicationInputDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the listing to apply to',
  })
  @IsString()
  @IsNotEmpty()
  listing_id: string;
}
