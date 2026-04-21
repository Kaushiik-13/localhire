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
import { CustomersService } from './customers.service';
import {
  CreateCustomerInputDto,
  UpdateCustomerProfileInputDto,
} from './dto/inputs/customer.input.dto';
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

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a customer profile' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'User not found or not a customer' })
  @ApiResponse({ status: 409, description: 'Customer profile already exists' })
  create(
    @Body() createCustomerDto: CreateCustomerInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.customersService.create(createCustomerDto, req.user.userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own customer profile with user details' })
  @ApiResponse({ status: 200, description: 'Customer profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer profile not found' })
  async getOwnProfile(@Request() req: AuthenticatedRequest) {
    return this.customersService.getOwnProfile(req.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own customer profile' })
  @ApiResponse({ status: 200, description: 'Customer profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer profile not found' })
  async updateOwnProfile(
    @Body() dto: UpdateCustomerProfileInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.customersService.updateOwnProfile(req.user.userId, dto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own customer profile and user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer profile not found' })
  async deleteOwnProfile(@Request() req: AuthenticatedRequest) {
    return this.customersService.deleteOwnProfile(req.user.userId);
  }

  @Patch('me/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle own user status between active and deactive' })
  @ApiResponse({ status: 200, description: 'Status toggled successfully' })
  @ApiResponse({ status: 404, description: 'Customer profile or user not found' })
  async toggleStatus(@Request() req: AuthenticatedRequest) {
    return this.customersService.toggleStatus(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.customersService.findByUserId(userId);
  }
}
