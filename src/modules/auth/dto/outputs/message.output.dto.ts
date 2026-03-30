import { ApiProperty } from '@nestjs/swagger';

export class AuthMessageOutputDto {
  @ApiProperty({ example: 'Admin created successfully' })
  message: string;
}
