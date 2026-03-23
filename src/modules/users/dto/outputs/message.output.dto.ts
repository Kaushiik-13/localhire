import { ApiProperty } from '@nestjs/swagger';

export class MessageOutputDto {
  @ApiProperty({ example: 'User registered successfully' })
  message: string;
}
