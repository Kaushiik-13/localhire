import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  Query,
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
  JobApplicationListOutputDto,
  JobApplicationMessageOutputDto,
} from './dto/outputs/job-application.output.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
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

  @Get('available-listings')
  @ApiOperation({ summary: 'Get available listings for job applications' })
  @ApiQuery({
    name: 'types',
    required: false,
    isArray: true,
    enum: ['job', 'service'],
    description: 'Filter by listing type',
  })
  @ApiResponse({
    status: 200,
    type: JobApplicationListOutputDto,
    description: 'Returns approved and active listings',
  })
  findAvailableListings(@Query('types') types?: string[]) {
    return this.jobApplicationsService.findAvailableListings(types || ['job']);
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'Get job applications by listing ID' })
  @ApiResponse({ type: JobApplicationListOutputDto })
  findByListing(@Param('listingId') listingId: string) {
    return this.jobApplicationsService.findByListing(listingId);
  }

  @Get('worker/:workerId')
  @ApiOperation({ summary: 'Get job applications by worker ID' })
  @ApiResponse({ type: JobApplicationListOutputDto })
  findByWorker(@Param('workerId') workerId: string) {
    return this.jobApplicationsService.findByWorker(workerId);
  }

  @Get('employer/my-applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get job applications for employer listings' })
  @ApiResponse({ type: JobApplicationListOutputDto })
  findByEmployer(@Request() req: AuthenticatedRequest) {
    return this.jobApplicationsService.findByEmployer(req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER)
  @ApiOperation({
    summary: 'Update application status - accept/reject (employer only)',
  })
  @ApiResponse({ type: JobApplicationOutputDto })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateApplicationStatusInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.jobApplicationsService.updateApplicationStatus(
      id,
      updateStatusDto,
      req.user.userId,
    );
  }

  @Post(':id/withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.WORKER)
  @ApiOperation({ summary: 'Withdraw application (worker only)' })
  @ApiResponse({ type: JobApplicationOutputDto })
  withdraw(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.jobApplicationsService.withdrawApplication(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.WORKER, Role.EMPLOYER)
  @ApiOperation({ summary: 'Delete a job application' })
  @ApiResponse({ type: JobApplicationMessageOutputDto })
  remove(@Param('id') id: string) {
    return this.jobApplicationsService.remove(id);
  }
}
