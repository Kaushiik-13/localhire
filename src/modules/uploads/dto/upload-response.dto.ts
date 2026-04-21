import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ example: 'users/profiles/507f1f77bcf86cd799439011-avatar.jpg' })
  key: string;

  @ApiProperty({ example: 'https://localhire-assets.s3.amazonaws.com/users/profiles/507f1f77bcf86cd799439011-avatar.jpg' })
  url: string;
}

export class UploadMessageDto {
  @ApiProperty({ example: 'File uploaded successfully' })
  message: string;
}
