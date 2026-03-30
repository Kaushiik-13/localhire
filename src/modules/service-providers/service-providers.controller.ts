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
import { ServiceProvidersService } from './service-providers.service';
import { CreateServiceProviderInputDto } from './dto/inputs/service-provider.input.dto';
import { UpdateServiceProviderInputDto } from './dto/inputs/service-provider.input.dto';
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

@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.SERVICE_PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a service provider profile' })
  @ApiResponse({
    status: 201,
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
