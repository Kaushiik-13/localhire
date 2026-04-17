import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import {
  CreateWorkerInputDto,
  UpdateWorkerProfileInputDto,
} from './dto/inputs/worker.input.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles_decorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

interface AuthenticatedRequest {
  user: {
    userId: string;
    phone: string;
    roles: Role[];
  };
}

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.WORKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a worker profile' })
  @ApiResponse({ status: 201, description: 'Worker created successfully' })
  @ApiResponse({ status: 400, description: 'User not found or not a worker' })
  @ApiResponse({ status: 409, description: 'Worker profile already exists' })
  create(
    @Body() createWorkerDto: CreateWorkerInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.workersService.create(createWorkerDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.workersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own worker profile with user details' })
  @ApiResponse({
    status: 200,
    description: 'Worker profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Worker profile not found' })
  async getOwnProfile(@Request() req: AuthenticatedRequest) {
    return this.workersService.getOwnProfile(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own worker profile and user details' })
  @ApiResponse({
    status: 200,
    description: 'Worker profile and user details updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Worker profile not found' })
  async updateOwnProfile(
    @Body() dto: UpdateWorkerProfileInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.workersService.updateOwnProfile(req.user.userId, dto);
  }

  @Patch('me/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Toggle own user status between active and deactive',
  })
  @ApiResponse({ status: 200, description: 'Status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Worker profile or user not found' })
  async toggleStatus(@Request() req: AuthenticatedRequest) {
    return this.workersService.toggleStatus(req.user.userId);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own worker profile and user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Worker profile not found' })
  async deleteOwnProfile(@Request() req: AuthenticatedRequest) {
    return this.workersService.deleteOwnProfile(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.workersService.findByUserId(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workersService.remove(id);
  }
}
