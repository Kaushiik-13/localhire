import { ApiProperty } from '@nestjs/swagger';

export class MessageOutputDto {
  @ApiProperty({ example: 'Admin created successfully' })
  message: string;
}
