import { ApiProperty } from '@nestjs/swagger';

export class TopCityDto {
  @ApiProperty({ example: 'Chennai' })
  city: string;

  @ApiProperty({ example: 4820 })
  userCount: number;
}

export class TopCitiesOutputDto {
  @ApiProperty({ example: 5 })
  count: number;

  @ApiProperty({ type: [TopCityDto] })
  data: TopCityDto[];
}
