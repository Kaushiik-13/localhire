import { ApiProperty } from '@nestjs/swagger';
import { UserOutputDto } from './user.output.dto';

export class UserLoginOutputDto {
  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ type: UserOutputDto })
  user: UserOutputDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
}
