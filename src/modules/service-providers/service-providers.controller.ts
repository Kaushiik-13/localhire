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
  Query,
} from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { CreateServiceProviderInputDto } from './dto/inputs/service-provider.input.dto';
import { UpdateServiceProviderInputDto } from './dto/inputs/service-provider.input.dto';
import { ServiceProviderOutputDto } from './dto/outputs/service-provider.output.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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

@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a service provider profile' })
  @ApiResponse({
    status: 201,
    type: ServiceProviderOutputDto,
    description: 'Service provider created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'User not found or not a service provider',
  })
  @ApiResponse({
    status: 409,
    description: 'Service provider profile already exists',
  })
  create(
    @Body() createServiceProviderDto: CreateServiceProviderInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceProvidersService.create(
      createServiceProviderDto,
      req.user.userId,
    );
  }

  @Get()
  findAll() {
    return this.serviceProvidersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.SERVICE_PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own service provider profile with user details' })
  @ApiResponse({ status: 200, type: ServiceProviderOutputDto, description: 'Service provider profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Service provider profile not found' })
  async getOwnProfile(@Request() req: AuthenticatedRequest) {
    return this.serviceProvidersService.getOwnProfile(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.SERVICE_PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own service provider profile' })
  @ApiResponse({ status: 200, type: ServiceProviderOutputDto, description: 'Service provider profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Service provider profile not found' })
  async updateOwnProfile(
    @Body() dto: UpdateServiceProviderInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceProvidersService.updateOwnProfile(req.user.userId, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.SERVICE_PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own service provider profile and user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service provider profile not found' })
  async deleteOwnProfile(@Request() req: AuthenticatedRequest) {
    return this.serviceProvidersService.deleteOwnProfile(req.user.userId);
  }

  @Patch('me/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.SERVICE_PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle own user status between active and deactive' })
  @ApiResponse({ status: 200, description: 'Status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Service provider profile or user not found' })
  async toggleStatus(@Request() req: AuthenticatedRequest) {
    return this.serviceProvidersService.toggleStatus(req.user.userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search and filter service providers' })
  @ApiQuery({ name: 'skill', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'min_rating', required: false, type: Number })
  @ApiQuery({ name: 'max_hourly_rate', required: false, type: Number })
  @ApiQuery({ name: 'availability', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('skill') skill?: string,
    @Query('location') location?: string,
    @Query('min_rating') minRating?: string,
    @Query('max_hourly_rate') maxHourlyRate?: string,
    @Query('availability') availability?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.serviceProvidersService.search({
      skill,
      location,
      minRating: minRating ? parseFloat(minRating) : undefined,
      maxHourlyRate: maxHourlyRate ? parseFloat(maxHourlyRate) : undefined,
      availability,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceProvidersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.serviceProvidersService.findByUserId(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceProviderDto: UpdateServiceProviderInputDto,
  ) {
    return this.serviceProvidersService.update(id, updateServiceProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceProvidersService.remove(id);
  }
}
