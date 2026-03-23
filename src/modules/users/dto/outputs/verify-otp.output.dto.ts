import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpOutputDto {
  @ApiProperty({ example: 'OTP verified successfully' })
  message: string;

  @ApiProperty({ example: true })
  valid: boolean;
}
