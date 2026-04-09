import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../../../../common/enums/status.enum';

export class CreateJobApplicationInputDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the listing to apply to',
  })
  @IsString()
  @IsNotEmpty()
  listing_id: string;
}

export class UpdateApplicationStatusInputDto {
  @ApiProperty({
    enum: ApplicationStatus,
    example: ApplicationStatus.ACCEPTED,
    description: 'The status to update to (accepted or rejected)',
  })
  @IsEnum([ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED])
  @IsNotEmpty()
  status: ApplicationStatus;
}

export class WithdrawApplicationInputDto {
  @ApiPropertyOptional({
    enum: ApplicationStatus,
    example: ApplicationStatus.WITHDRAWN,
    description: 'Status to set (defaults to withdrawn)',
  })
  @IsEnum([ApplicationStatus.WITHDRAWN])
  @IsNotEmpty()
  status?: ApplicationStatus;
}
