import { ApiProperty } from '@nestjs/swagger';
import { AdminOutputDto } from './admin.output.dto';

export class AdminLoginOutputDto {
  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ type: AdminOutputDto })
  admin: AdminOutputDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
}
