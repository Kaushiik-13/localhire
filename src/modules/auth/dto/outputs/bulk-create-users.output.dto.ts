import { ApiProperty } from '@nestjs/swagger';

export class BulkCreateUserResultDto {
  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: ['success', 'failed'] })
  status: 'success' | 'failed';

  @ApiProperty()
  message: string;
}

export class BulkCreateUsersOutputDto {
  @ApiProperty({ example: 'Bulk user creation completed' })
  message: string;

  @ApiProperty({ example: 8 })
  created_count: number;

  @ApiProperty({ example: 0 })
  failed_count: number;

  @ApiProperty({ type: [BulkCreateUserResultDto] })
  results: BulkCreateUserResultDto[];
}
