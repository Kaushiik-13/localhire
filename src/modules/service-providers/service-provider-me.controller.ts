import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { ServiceProviderOutputDto } from './dto/outputs/service-provider.output.dto';
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

@Controller('service-provider')
export class ServiceProviderMeController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

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
}
