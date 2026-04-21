import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import {
  CreateReportInputDto,
  UpdateReportInputDto,
  ResolveReportInputDto,
  AddNoteInputDto,
} from './dto/inputs/report.input.dto';
import {
  ReportOutputDto,
  ReportListOutputDto,
  ReportStatsOutputDto,
  ReportMessageOutputDto,
} from './dto/outputs/report.output.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles_decorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

interface AuthenticatedRequest {
  user: {
    userId: string;
    phone?: string;
    roles: string[];
  };
}

@ApiTags('reports')
@Controller('reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get report statistics (admin only)' })
  @ApiResponse({ status: 200, type: ReportStatsOutputDto })
  getStats() {
    return this.reportsService.getStats();
  }

  @Get('export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Export reports as CSV (admin only)' })
  @ApiResponse({ status: 200 })
  async exportCsv(@Res() res: Response) {
    const csv = await this.reportsService.exportCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=reports.csv');
    res.send(csv);
  }

  @Get('my-reports')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get reports posted by the authenticated user',
  })
  @ApiResponse({ status: 200, type: ReportListOutputDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  findMyReports(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.reportsService.findMyReports(
      req.user.userId,
      Number(page) || 1,
      Number(limit) || 20,
      status,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all reports with filters and pagination (admin only)',
  })
  @ApiResponse({ status: 200, type: ReportListOutputDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'reportedBy', required: false })
  @ApiQuery({ name: 'against', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('type') type?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('reportedBy') reportedBy?: string,
    @Query('against') against?: string,
  ) {
    return this.reportsService.findAll(Number(page) || 1, Number(limit) || 20, {
      status,
      priority,
      type,
      dateFrom,
      dateTo,
      reportedBy,
      against,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(
    Role.WORKER,
    Role.EMPLOYER,
    Role.ADMIN,
    Role.SERVICE_PROVIDER,
    Role.CUSTOMER,
  )
  @ApiOperation({ summary: 'Create a new report/dispute' })
  @ApiResponse({ status: 201, type: ReportOutputDto })
  create(
    @Body() createReportDto: CreateReportInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.reportsService.create(createReportDto, req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get a single report by ID (admin only)' })
  @ApiResponse({ status: 200, type: ReportOutputDto })
  findById(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Update a report (admin only)' })
  @ApiResponse({ status: 200, type: ReportOutputDto })
  update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportInputDto,
  ) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Patch(':id/investigate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({
    summary: 'Mark report as under investigation (admin only, high priority)',
  })
  @ApiResponse({ status: 200, type: ReportOutputDto })
  investigate(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.reportsService.investigate(id, req.user.userId);
  }

  @Patch(':id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({
    summary: 'Mark report as under review (admin only, medium/low priority)',
  })
  @ApiResponse({ status: 200, type: ReportOutputDto })
  review(@Param('id') id: string) {
    return this.reportsService.review(id);
  }

  @Patch(':id/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Resolve/close a report (admin only)' })
  @ApiResponse({ status: 200, type: ReportOutputDto })
  resolve(
    @Param('id') id: string,
    @Body() resolveReportDto: ResolveReportInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.reportsService.resolve(id, resolveReportDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a report (admin only)' })
  @ApiResponse({ status: 200, type: ReportMessageOutputDto })
  delete(@Param('id') id: string) {
    return this.reportsService.delete(id);
  }
}
