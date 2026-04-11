import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ReportType,
  ReportPriority,
  ReportStatus,
  ReportAction,
  EvidenceType,
  ReporterType,
  EntityType,
} from '../../../../common/enums/report.enum';

class ReportedByOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  userId: string;

  @ApiProperty({ enum: ReporterType, example: ReporterType.WORKER })
  userType: ReporterType;

  @ApiProperty({ example: 'Ramesh Kumar' })
  name: string;
}

class AgainstOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439012' })
  entityId: string;

  @ApiProperty({ enum: EntityType, example: EntityType.EMPLOYER })
  entityType: EntityType;

  @ApiProperty({ example: 'Chennai Repairs' })
  name: string;
}

class ResolutionOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439013' })
  resolvedBy: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  resolvedAt: Date;

  @ApiProperty({ example: 'Investigation complete. Post removed.' })
  resolutionNote: string;

  @ApiProperty({ enum: ReportAction, example: ReportAction.POST_REMOVED })
  action: ReportAction;
}

class EvidenceOutputDto {
  @ApiProperty({ example: 'https://example.com/evidence.png' })
  url: string;

  @ApiProperty({ enum: EvidenceType, example: EvidenceType.SCREENSHOT })
  type: EvidenceType;

  @ApiProperty({ example: '2024-01-10T08:00:00.000Z' })
  uploadedAt: Date;
}

class NoteOutputDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  addedBy: string;

  @ApiProperty({ example: 'Started investigating the claim' })
  note: string;

  @ApiProperty({ example: '2024-01-12T09:00:00.000Z' })
  addedAt: Date;
}

export class ReportOutputDto {
  @ApiProperty({ example: 'RPT-084' })
  reportId: string;

  @ApiProperty({ type: ReportedByOutputDto })
  reportedBy: ReportedByOutputDto;

  @ApiProperty({ type: AgainstOutputDto })
  against: AgainstOutputDto;

  @ApiProperty({ enum: ReportType, example: ReportType.UNPAID_WAGE })
  type: ReportType;

  @ApiProperty({ example: 'Worker was not paid for 2 weeks of work' })
  description: string;

  @ApiProperty({ enum: ReportPriority, example: ReportPriority.HIGH })
  priority: ReportPriority;

  @ApiProperty({ enum: ReportStatus, example: ReportStatus.OPEN })
  status: ReportStatus;

  @ApiProperty({ type: ResolutionOutputDto, required: false, nullable: true })
  resolution?: ResolutionOutputDto;

  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    required: false,
    nullable: true,
  })
  assignedTo?: string;

  @ApiProperty({ type: [EvidenceOutputDto] })
  evidence: EvidenceOutputDto[];

  @ApiProperty({ type: [NoteOutputDto] })
  notes: NoteOutputDto[];

  @ApiProperty({ example: '2024-01-10T08:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-10T08:00:00.000Z' })
  updatedAt: Date;
}

export class ReportListOutputDto {
  @ApiProperty({ example: 25 })
  count: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ type: [Object] })
  data: Record<string, any>[];
}

export class ReportStatsOutputDto {
  @ApiProperty({ example: 8 })
  openDisputes: number;

  @ApiProperty({ example: 2 })
  openDisputesTrend: number;

  @ApiProperty({ example: 34 })
  resolvedThisMonth: number;

  @ApiProperty({ example: 3 })
  fraudulentPosts: number;

  @ApiProperty({ example: 1.4 })
  avgResolutionTime: number;
}

export class ReportMessageOutputDto {
  @ApiProperty({ example: 'Report created successfully' })
  message: string;
}
