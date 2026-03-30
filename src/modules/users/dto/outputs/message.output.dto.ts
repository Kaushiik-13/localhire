import { ApiProperty } from '@nestjs/swagger';

export class UserMessageOutputDto {
  @ApiProperty({ example: 'User registered successfully' })
  message: string;
}
