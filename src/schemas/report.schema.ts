import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  ReportType,
  ReportPriority,
  ReportStatus,
  ReportAction,
  EvidenceType,
  ReporterType,
  EntityType,
} from '../common/enums/report.enum';

export type ReportDocument = Report & Document;

@Schema()
export class ReportedBy {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ enum: ReporterType, required: true })
  userType: ReporterType;

  @Prop({ required: true })
  name: string;
}

@Schema()
export class Against {
  @Prop({ type: Types.ObjectId })
  entityId: Types.ObjectId;

  @Prop({ enum: EntityType, required: true })
  entityType: EntityType;

  @Prop({ required: true })
  name: string;
}

@Schema()
export class Resolution {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  resolvedBy: Types.ObjectId;

  @Prop()
  resolvedAt: Date;

  @Prop()
  resolutionNote: string;

  @Prop({ enum: ReportAction })
  action: ReportAction;
}

@Schema()
export class Evidence {
  @Prop({ required: true })
  url: string;

  @Prop({ enum: EvidenceType })
  type: EvidenceType;

  @Prop()
  uploadedAt: Date;
}

@Schema()
export class Note {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  addedBy: Types.ObjectId;

  @Prop({ required: true })
  note: string;

  @Prop()
  addedAt: Date;
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true, unique: true })
  reportId: string;

  @Prop({ type: ReportedBy, required: true })
  reportedBy: ReportedBy;

  @Prop({ type: Against, required: true })
  against: Against;

  @Prop({ enum: ReportType, required: true })
  type: ReportType;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ReportPriority, default: ReportPriority.MEDIUM })
  priority: ReportPriority;

  @Prop({ enum: ReportStatus, default: ReportStatus.OPEN })
  status: ReportStatus;

  @Prop({ type: Resolution })
  resolution?: Resolution;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId;

  @Prop({ type: [Evidence], default: [] })
  evidence: Evidence[];

  @Prop({ type: [Note], default: [] })
  notes: Note[];
}

export const ReportSchema = SchemaFactory.createForClass(Report);
