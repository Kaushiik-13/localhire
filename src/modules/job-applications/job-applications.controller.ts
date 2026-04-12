import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JobApplicationsService } from './job-applications.service';
import {
  CreateJobApplicationInputDto,
  UpdateApplicationStatusInputDto,
} from './dto/inputs/job-application.input.dto';
import {
  JobApplicationOutputDto,
  ListingApplicantsOutputDto,
  WorkerApplicationsListOutputDto,
  ApplicationStatusUpdateOutputDto,
  DeleteAllOutputDto,
} from './dto/outputs/job-application.output.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles_decorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

interface AuthenticatedRequest {
  user: {
    userId: string;
  };
}

@Controller('job-applications')
@ApiBearerAuth()
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.WORKER)
  @ApiOperation({ summary: 'Create a job application (worker only)' })
  @ApiResponse({ status: 201, type: JobApplicationOutputDto })
  create(
    @Body() createJobApplicationDto: CreateJobApplicationInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.jobApplicationsService.create(
      createJobApplicationDto.listing_id,
      req.user.userId,
    );
  }

  @Get('my-applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.WORKER)
  @ApiOperation({
    summary: 'Get job applications for the authenticated worker',
  })
  @ApiResponse({ status: 200, type: WorkerApplicationsListOutputDto })
  findMyApplications(@Request() req: AuthenticatedRequest) {
    return this.jobApplicationsService.findByWorkerApplications(
      req.user.userId,
    );
  }

  @Get('listing/:listingId/applicants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get applicants for a listing (employer only)' })
  @ApiResponse({ status: 200, type: ListingApplicantsOutputDto })
  findApplicantsByListing(
    @Param('listingId') listingId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.jobApplicationsService.findApplicantsByListing(
      listingId,
      req.user.userId,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all job applications' })
  @ApiResponse({ status: 200, type: DeleteAllOutputDto })
  deleteAll() {
    return this.jobApplicationsService.deleteAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER)
  @ApiOperation({
    summary: 'Update application status - accept/reject (employer only)',
  })
  @ApiResponse({ status: 200, type: ApplicationStatusUpdateOutputDto })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.jobApplicationsService.updateApplicationStatus(
      id,
      updateStatusDto.status,
      req.user.userId,
    );
  }

  @Post(':id/withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.WORKER)
  @ApiOperation({ summary: 'Withdraw application (worker only)' })
  @ApiResponse({ type: ApplicationStatusUpdateOutputDto })
  withdraw(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.jobApplicationsService.withdrawApplication(id, req.user.userId);
  }
}
