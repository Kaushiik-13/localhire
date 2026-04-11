import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ReportType,
  ReportPriority,
  ReportStatus,
  ReportAction,
  EvidenceType,
  EntityType,
  ReporterType,
} from '../../../../common/enums/report.enum';

class ReportedByInputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ReporterType, example: ReporterType.WORKER })
  @IsEnum(ReporterType)
  @IsNotEmpty()
  userType: ReporterType;

  @ApiProperty({ example: 'Ramesh Kumar' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

class AgainstInputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ enum: EntityType, example: EntityType.EMPLOYER })
  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @ApiProperty({ example: 'Chennai Repairs' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

class EvidenceInputDto {
  @ApiProperty({ example: 'https://example.com/evidence.png' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ enum: EvidenceType, example: EvidenceType.SCREENSHOT })
  @IsEnum(EvidenceType)
  @IsOptional()
  type?: EvidenceType;
}

export class CreateReportInputDto {
  @ApiProperty({ type: ReportedByInputDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ReportedByInputDto)
  reportedBy: ReportedByInputDto;

  @ApiProperty({ type: AgainstInputDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AgainstInputDto)
  against: AgainstInputDto;

  @ApiProperty({ enum: ReportType, example: ReportType.UNPAID_WAGE })
  @IsEnum(ReportType)
  @IsNotEmpty()
  type: ReportType;

  @ApiProperty({ example: 'Worker was not paid for 2 weeks of work' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    enum: ReportPriority,
    example: ReportPriority.HIGH,
  })
  @IsEnum(ReportPriority)
  @IsOptional()
  priority?: ReportPriority;

  @ApiPropertyOptional({ type: [EvidenceInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenceInputDto)
  @IsOptional()
  evidence?: EvidenceInputDto[];
}

export class UpdateReportInputDto {
  @ApiPropertyOptional({
    enum: ReportPriority,
    example: ReportPriority.HIGH,
  })
  @IsEnum(ReportPriority)
  @IsOptional()
  priority?: ReportPriority;

  @ApiPropertyOptional({
    enum: ReportStatus,
    example: ReportStatus.INVESTIGATING,
  })
  @IsEnum(ReportStatus)
  @IsOptional()
  status?: ReportStatus;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsOptional()
  assignedTo?: string;
}

export class ResolveReportInputDto {
  @ApiProperty({
    example: 'Investigation complete. Post removed for violating terms.',
  })
  @IsString()
  @IsNotEmpty()
  resolutionNote: string;

  @ApiProperty({ enum: ReportAction, example: ReportAction.POST_REMOVED })
  @IsEnum(ReportAction)
  @IsNotEmpty()
  action: ReportAction;
}

export class AddNoteInputDto {
  @ApiProperty({ example: 'Started investigating the claim' })
  @IsString()
  @IsNotEmpty()
  note: string;
}
