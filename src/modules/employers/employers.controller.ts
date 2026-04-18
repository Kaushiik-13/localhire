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
import { EmployersService } from './employers.service';
import { CreateEmployerInputDto } from './dto/inputs/employer.input.dto';
import { UpdateEmployerProfileInputDto } from './dto/inputs/employer.input.dto';
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

@Controller('employers')
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an employer profile' })
  @ApiResponse({ status: 201, description: 'Employer created successfully' })
  @ApiResponse({
    status: 400,
    description: 'User not found or not an employer',
  })
  @ApiResponse({ status: 409, description: 'Employer profile already exists' })
  create(
    @Body() createEmployerDto: CreateEmployerInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.employersService.create(createEmployerDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.employersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own employer profile with user details' })
  @ApiResponse({
    status: 200,
    description: 'Employer profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Employer profile not found' })
  async getOwnProfile(@Request() req: AuthenticatedRequest) {
    return this.employersService.getOwnProfile(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own employer profile and user details' })
  @ApiResponse({
    status: 200,
    description: 'Employer profile and user details updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Employer profile not found' })
  async updateOwnProfile(
    @Body() dto: UpdateEmployerProfileInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.employersService.updateOwnProfile(req.user.userId, dto);
  }

  @Patch('me/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Toggle own user status between active and deactive',
  })
  @ApiResponse({ status: 200, description: 'Status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Employer profile or user not found' })
  async toggleStatus(@Request() req: AuthenticatedRequest) {
    return this.employersService.toggleStatus(req.user.userId);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own employer profile and user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Employer profile not found' })
  async deleteOwnProfile(@Request() req: AuthenticatedRequest) {
    return this.employersService.deleteOwnProfile(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.employersService.findByUserId(userId);
  }
}
