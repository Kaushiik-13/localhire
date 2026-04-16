import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles_decorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { ApprovalStatus } from '../../common/enums/approval.enum';
import type { Response } from 'express';

interface AuthenticatedRequest {
  user: {
    userId: string;
  };
}

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ============ USERS ============

  @Get('users/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all pending users' })
  @ApiResponse({ status: 200 })
  findPendingUsers() {
    return this.adminService.findUsersByStatus(ApprovalStatus.PENDING);
  }

  @Get('users/approved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all approved users' })
  @ApiResponse({ status: 200 })
  findApprovedUsers() {
    return this.adminService.findUsersByStatus(ApprovalStatus.APPROVED);
  }

  @Get('users/rejected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all rejected users' })
  @ApiResponse({ status: 200 })
  findRejectedUsers() {
    return this.adminService.findUsersByStatus(ApprovalStatus.REJECTED);
  }

  @Post('users/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Approve a user' })
  @ApiResponse({ status: 200 })
  approveUser(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.adminService.approveUser(id, req.user.userId);
  }

  @Post('users/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Reject a user' })
  @ApiResponse({ status: 200 })
  rejectUser(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.adminService.rejectUser(id, req.user.userId);
  }

  @Post('users/:id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Suspend a user' })
  @ApiResponse({ status: 200 })
  suspendUser(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.adminService.suspendUser(id, req.user.userId);
  }

  @Get('users/suspended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all suspended users' })
  @ApiResponse({ status: 200 })
  findSuspendedUsers() {
    return this.adminService.findUsersByStatus(ApprovalStatus.SUSPENDED);
  }

  @Post('users/:userId/identity-docs/:docId/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Approve a user identity document' })
  @ApiResponse({ status: 200 })
  approveIdentityDoc(
    @Param('userId') userId: string,
    @Param('docId') docId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.adminService.approveIdentityDoc(userId, docId, req.user.userId);
  }

  @Post('users/:userId/identity-docs/:docId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Reject a user identity document' })
  @ApiResponse({ status: 200 })
  rejectIdentityDoc(
    @Param('userId') userId: string,
    @Param('docId') docId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.adminService.rejectIdentityDoc(userId, docId, req.user.userId);
  }

  // ============ WORKERS ============

  @Get('workers/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all pending workers' })
  @ApiResponse({ status: 200 })
  findPendingWorkers() {
    return this.adminService.findWorkersByStatus(ApprovalStatus.PENDING);
  }

  @Get('workers/approved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all approved workers' })
  @ApiResponse({ status: 200 })
  findApprovedWorkers() {
    return this.adminService.findWorkersByStatus(ApprovalStatus.APPROVED);
  }

  @Get('workers/rejected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all rejected workers' })
  @ApiResponse({ status: 200 })
  findRejectedWorkers() {
    return this.adminService.findWorkersByStatus(ApprovalStatus.REJECTED);
  }

  @Post('workers/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Approve a worker' })
  @ApiResponse({ status: 200 })
  approveWorker(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.adminService.approveWorker(id, req.user.userId);
  }

  @Post('workers/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Reject a worker' })
  @ApiResponse({ status: 200 })
  rejectWorker(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.adminService.rejectWorker(id, req.user.userId);
  }

  @Post('workers/:id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Suspend a worker' })
  @ApiResponse({ status: 200 })
  suspendWorker(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.adminService.suspendWorker(id, req.user.userId);
  }

  @Get('workers/suspended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all suspended workers' })
  @ApiResponse({ status: 200 })
  findSuspendedWorkers() {
    return this.adminService.findWorkersByStatus(ApprovalStatus.SUSPENDED);
  }

  // ============ EMPLOYERS ============

  @Get('employers/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all pending employers' })
  @ApiResponse({ status: 200 })
  findPendingEmployers() {
    return this.adminService.findEmployersByStatus(ApprovalStatus.PENDING);
  }

  @Get('employers/approved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all approved employers' })
  @ApiResponse({ status: 200 })
  findApprovedEmployers() {
    return this.adminService.findEmployersByStatus(ApprovalStatus.APPROVED);
  }

  @Get('employers/rejected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all rejected employers' })
  @ApiResponse({ status: 200 })
  findRejectedEmployers() {
    return this.adminService.findEmployersByStatus(ApprovalStatus.REJECTED);
  }

  @Post('employers/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Approve an employer' })
  @ApiResponse({ status: 200 })
  approveEmployer(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.adminService.approveEmployer(id, req.user.userId);
  }

  @Post('employers/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Reject an employer' })
  @ApiResponse({ status: 200 })
  rejectEmployer(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.adminService.rejectEmployer(id, req.user.userId);
  }

  @Post('employers/:id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Suspend an employer' })
  @ApiResponse({ status: 200 })
  suspendEmployer(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.adminService.suspendEmployer(id, req.user.userId);
  }

  @Get('employers/suspended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all suspended employers' })
  @ApiResponse({ status: 200 })
  findSuspendedEmployers() {
    return this.adminService.findEmployersByStatus(ApprovalStatus.SUSPENDED);
  }

  // ============ SERVICE PROVIDERS ============

  @Get('service-providers/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all pending service providers' })
  @ApiResponse({ status: 200 })
  findPendingServiceProviders() {
    return this.adminService.findServiceProvidersByStatus(
      ApprovalStatus.PENDING,
    );
  }

  @Get('service-providers/approved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all approved service providers' })
  @ApiResponse({ status: 200 })
  findApprovedServiceProviders() {
    return this.adminService.findServiceProvidersByStatus(
      ApprovalStatus.APPROVED,
    );
  }

  @Get('service-providers/rejected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all rejected service providers' })
  @ApiResponse({ status: 200 })
  findRejectedServiceProviders() {
    return this.adminService.findServiceProvidersByStatus(
      ApprovalStatus.REJECTED,
    );
  }

  @Post('service-providers/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Approve a service provider' })
  @ApiResponse({ status: 200 })
  approveServiceProvider(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.adminService.approveServiceProvider(id, req.user.userId);
  }

  @Post('service-providers/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Reject a service provider' })
  @ApiResponse({ status: 200 })
  rejectServiceProvider(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.adminService.rejectServiceProvider(id, req.user.userId);
  }

  @Post('service-providers/:id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Suspend a service provider' })
  @ApiResponse({ status: 200 })
  suspendServiceProvider(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.adminService.suspendServiceProvider(id, req.user.userId);
  }

  @Get('service-providers/suspended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all suspended service providers' })
  @ApiResponse({ status: 200 })
  findSuspendedServiceProviders() {
    return this.adminService.findServiceProvidersByStatus(
      ApprovalStatus.SUSPENDED,
    );
  }

  // ============ DASHBOARD ============

  @Get('dashboard/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200 })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/listings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get listings summary by type, status, approval' })
  @ApiResponse({ status: 200 })
  getListingsSummary() {
    return this.adminService.getListingsSummary();
  }

  @Get('dashboard/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get applications/bookings summary by status' })
  @ApiResponse({ status: 200 })
  getApplicationsSummary() {
    return this.adminService.getApplicationsSummary();
  }

  @Get('dashboard/trends')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiQuery({ name: 'months', required: false, type: Number })
  @ApiOperation({ summary: 'Get monthly trends' })
  @ApiResponse({ status: 200 })
  getTrends(@Query('months') months?: number) {
    return this.adminService.getTrends(months || 6);
  }

  // ============ LISTINGS ANALYTICS ============

  @Get('dashboard/listings/by-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get listings by status' })
  @ApiResponse({ status: 200 })
  getListingsByStatus() {
    return this.adminService.getListingsByStatus();
  }

  @Get('dashboard/listings/by-approval')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get listings by approval status' })
  @ApiResponse({ status: 200 })
  getListingsByApproval() {
    return this.adminService.getListingsByApproval();
  }

  @Get('dashboard/listings/by-type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get listings by type' })
  @ApiResponse({ status: 200 })
  getListingsByType() {
    return this.adminService.getListingsByType();
  }

  @Get('dashboard/listings/by-job-type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get job listings by availability type' })
  @ApiResponse({ status: 200 })
  getListingsByJobType() {
    return this.adminService.getListingsByJobType();
  }

  @Get('dashboard/listings/by-location')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get listings by location (city)' })
  @ApiResponse({ status: 200 })
  getListingsByLocation() {
    return this.adminService.getListingsByLocation();
  }

  @Get('dashboard/listings/by-skills')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get most requested skills in listings' })
  @ApiResponse({ status: 200 })
  getListingsBySkills() {
    return this.adminService.getListingsBySkills();
  }

  @Get('dashboard/skills-stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({
    summary: 'Get skills statistics with worker and service provider counts',
  })
  @ApiResponse({ status: 200 })
  getSkillsStats() {
    return this.adminService.getSkillsStats();
  }

  @Get('dashboard/listings/salary-range')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get salary ranges for job listings' })
  @ApiResponse({ status: 200 })
  getListingsSalaryRange() {
    return this.adminService.getListingsSalaryRange();
  }

  @Get('dashboard/listings/price-range')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get price ranges for service listings' })
  @ApiResponse({ status: 200 })
  getListingsPriceRange() {
    return this.adminService.getListingsPriceRange();
  }

  @Get('dashboard/listings/expiring-soon')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiOperation({ summary: 'Get listings expiring soon' })
  @ApiResponse({ status: 200 })
  getListingsExpiringSoon(@Query('days') days?: number) {
    return this.adminService.getListingsExpiringSoon(days || 30);
  }

  @Get('dashboard/listings/popular')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOperation({ summary: 'Get most popular listings by applications' })
  @ApiResponse({ status: 200 })
  getPopularListings(@Query('limit') limit?: number) {
    return this.adminService.getPopularListings(limit || 10);
  }

  // ============ CSV EXPORT ============

  @Get('export/listings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Export listings to CSV' })
  @ApiResponse({ status: 200 })
  async exportListingsCsv(@Res() res: Response) {
    const csv = await this.adminService.exportListingsCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=listings.csv');
    res.send(csv);
  }

  @Get('export/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Export users to CSV' })
  @ApiResponse({ status: 200 })
  async exportUsersCsv(@Res() res: Response) {
    const csv = await this.adminService.exportUsersCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csv);
  }

  @Get('export/workers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Export workers to CSV' })
  @ApiResponse({ status: 200 })
  async exportWorkersCsv(@Res() res: Response) {
    const csv = await this.adminService.exportWorkersCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=workers.csv');
    res.send(csv);
  }
}
