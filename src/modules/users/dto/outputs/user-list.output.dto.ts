import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from './user.output.dto';

export class UserListOutputDto {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: [UserOutputDto] })
  users: UserOutputDto[];
}
