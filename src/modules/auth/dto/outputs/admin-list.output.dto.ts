import { ApiProperty } from '@nestjs/swagger';
import { AdminOutputDto } from './admin.output.dto';

export class AdminListOutputDto {
  @ApiProperty({ example: 2 })
  count: number;

  @ApiProperty({ type: [AdminOutputDto] })
  admins: AdminOutputDto[];
}
