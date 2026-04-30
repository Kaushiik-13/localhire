import { ApiProperty } from '@nestjs/swagger';

export class TopCityOutputDto {
  @ApiProperty({ example: 'Chennai' })
  city: string;

  @ApiProperty({ example: 35.2 })
  percentage: number;

  @ApiProperty({ example: 150 })
  count: number;

  @ApiProperty({ example: 426 })
  totalListings: number;
}
