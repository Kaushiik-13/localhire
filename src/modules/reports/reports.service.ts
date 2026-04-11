import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument } from '../../schemas/report.schema';
import { Counter, CounterDocument } from '../../schemas/counter.schema';
import { CreateReportInputDto } from './dto/inputs/report.input.dto';
import { UpdateReportInputDto } from './dto/inputs/report.input.dto';
import { ResolveReportInputDto } from './dto/inputs/report.input.dto';
import { AddNoteInputDto } from './dto/inputs/report.input.dto';
import { ReportStatus } from '../../common/enums/report.enum';
import {
  ReportStatsOutputDto,
  ReportListOutputDto,
  ReportMessageOutputDto,
} from './dto/outputs/report.output.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name)
    private reportModel: Model<ReportDocument>,
    @InjectModel(Counter.name)
    private counterModel: Model<CounterDocument>,
  ) {}

  private async generateReportId(): Promise<string> {
    const counter = await this.counterModel.findOneAndUpdate(
      { entity_type: 'report' },
      { $inc: { seq: 1 } },
      { upsert: true, new: true },
    );
    return `RPT-${String(counter.seq).padStart(3, '0')}`;
  }

  async create(dto: CreateReportInputDto): Promise<ReportDocument> {
    const reportId = await this.generateReportId();

    const report = new this.reportModel({
      ...dto,
      reportId,
      reportedBy: {
        userId: new Types.ObjectId(dto.reportedBy.userId),
        userType: dto.reportedBy.userType,
        name: dto.reportedBy.name,
      },
      against: {
        entityId: new Types.ObjectId(dto.against.entityId),
        entityType: dto.against.entityType,
        name: dto.against.name,
      },
      evidence: dto.evidence?.map((e) => ({
        ...e,
        uploadedAt: new Date(),
      })),
    });

    return report.save();
  }

  async getStats(): Promise<ReportStatsOutputDto> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      openDisputes,
      prevMonthOpenDisputes,
      resolvedThisMonth,
      fraudulentPosts,
      resolvedReports,
    ] = await Promise.all([
      this.reportModel.countDocuments({ status: ReportStatus.OPEN }).exec(),
      this.reportModel
        .countDocuments({
          status: ReportStatus.OPEN,
          createdAt: { $lt: startOfMonth },
        })
        .exec(),
      this.reportModel
        .countDocuments({
          status: { $in: [ReportStatus.RESOLVED, ReportStatus.CLOSED] },
          'resolution.resolvedAt': { $gte: startOfMonth },
        })
        .exec(),
      this.reportModel.countDocuments({ type: 'fake_job_post' }).exec(),
      this.reportModel
        .find({
          status: { $in: [ReportStatus.RESOLVED, ReportStatus.CLOSED] },
          'resolution.resolvedAt': { $exists: true },
        })
        .exec(),
    ]);

    let avgResolutionTime = 0;
    if (resolvedReports.length > 0) {
      const totalHours = resolvedReports.reduce((sum: number, r: any) => {
        if (r.resolution?.resolvedAt && r.createdAt) {
          const diff =
            (new Date(r.resolution.resolvedAt).getTime() -
              new Date(r.createdAt).getTime()) /
            (1000 * 60 * 60 * 24);
          return sum + diff;
        }
        return sum;
      }, 0);
      avgResolutionTime =
        Math.round((totalHours / resolvedReports.length) * 10) / 10;
    }

    return {
      openDisputes,
      openDisputesTrend: openDisputes - prevMonthOpenDisputes,
      resolvedThisMonth,
      fraudulentPosts,
      avgResolutionTime,
    };
  }

  async findAll(
    page: number,
    limit: number,
    filters: {
      status?: string;
      priority?: string;
      type?: string;
      dateFrom?: string;
      dateTo?: string;
      reportedBy?: string;
      against?: string;
    },
  ): Promise<ReportListOutputDto> {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.type) query.type = filters.type;
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }
    if (filters.reportedBy) {
      query['reportedBy.userId'] = new Types.ObjectId(filters.reportedBy);
    }
    if (filters.against) {
      query['against.entityId'] = new Types.ObjectId(filters.against);
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.reportModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.reportModel.countDocuments(query).exec(),
    ]);

    return { count: total, page, limit, data };
  }

  async findById(id: string): Promise<ReportDocument> {
    const report = await this.reportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async update(id: string, dto: UpdateReportInputDto): Promise<ReportDocument> {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (dto.priority) report.priority = dto.priority;
    if (dto.status) report.status = dto.status;
    if (dto.assignedTo) report.assignedTo = new Types.ObjectId(dto.assignedTo);

    return report.save();
  }

  async investigate(id: string, adminId: string): Promise<ReportDocument> {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.priority !== 'high') {
      throw new NotFoundException(
        'Only high priority reports can be marked for investigation',
      );
    }

    report.status = ReportStatus.INVESTIGATING;
    report.assignedTo = new Types.ObjectId(adminId);
    return report.save();
  }

  async review(id: string): Promise<ReportDocument> {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.priority !== 'medium' && report.priority !== 'low') {
      throw new NotFoundException(
        'Only medium or low priority reports can be marked for review',
      );
    }

    report.status = ReportStatus.REVIEWING;
    return report.save();
  }

  async resolve(
    id: string,
    dto: ResolveReportInputDto,
    adminId: string,
  ): Promise<ReportDocument> {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = ReportStatus.RESOLVED;
    report.resolution = {
      resolvedBy: new Types.ObjectId(adminId),
      resolvedAt: new Date(),
      resolutionNote: dto.resolutionNote,
      action: dto.action,
    };
    return report.save();
  }

  async addNote(
    id: string,
    dto: AddNoteInputDto,
    adminId: string,
  ): Promise<ReportDocument> {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.notes.push({
      addedBy: new Types.ObjectId(adminId),
      note: dto.note,
      addedAt: new Date(),
    });
    return report.save();
  }

  async delete(id: string): Promise<ReportMessageOutputDto> {
    const report = await this.reportModel.findByIdAndDelete(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return { message: 'Report deleted successfully' };
  }

  async exportCsv(): Promise<string> {
    const reports = await this.reportModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    const headers = [
      'ReportID',
      'Type',
      'Priority',
      'Status',
      'ReportedBy',
      'Against',
      'Description',
      'CreatedAt',
    ].join(',');

    const rows = reports.map((r: any) =>
      [
        r.reportId,
        r.type,
        r.priority,
        r.status,
        `"${r.reportedBy?.name || ''}"`,
        `"${r.against?.name || ''}"`,
        `"${(r.description || '').replace(/"/g, '""')}"`,
        r.createdAt ? new Date(r.createdAt).toISOString() : '',
      ].join(','),
    );

    return [headers, ...rows].join('\n');
  }
}
