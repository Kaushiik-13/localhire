import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ServiceBookingsService } from './service-bookings.service';
import {
  CreateServiceBookingDto,
  UpdateServiceBookingStatusDto,
} from './dto/create-service-booking.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
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

@ApiTags('Service Bookings')
@Controller('service-bookings')
@ApiBearerAuth()
export class ServiceBookingsController {
  constructor(
    private readonly serviceBookingsService: ServiceBookingsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.SERVICE_PROVIDER)
  @ApiOperation({
    summary: 'Create a service booking (service provider applies)',
  })
  @ApiResponse({
    status: 201,
    description: 'Service booking created successfully',
  })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  create(@Body() createServiceBookingDto: CreateServiceBookingDto) {
    return this.serviceBookingsService.create(createServiceBookingDto);
  }

  @Get('available-listings')
  @ApiOperation({ summary: 'Get available listings for service bookings' })
  @ApiQuery({
    name: 'types',
    required: false,
    isArray: true,
    enum: ['job', 'service'],
    description: 'Filter by listing type',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns approved and active listings',
  })
  findAvailableListings(@Query('types') types?: string[]) {
    return this.serviceBookingsService.findAvailableListings(
      types || ['service'],
    );
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'Get service bookings by listing ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns service bookings for a listing',
  })
  findByListing(@Param('listingId') listingId: string) {
    return this.serviceBookingsService.findByListing(listingId);
  }

  @Get('service-provider/:serviceProviderId')
  @ApiOperation({ summary: 'Get service bookings by service provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns service bookings for a service provider',
  })
  findByServiceProvider(@Param('serviceProviderId') serviceProviderId: string) {
    return this.serviceBookingsService.findByServiceProvider(serviceProviderId);
  }

  @Get('service-provider/my-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.SERVICE_PROVIDER)
  @ApiOperation({
    summary: 'Get service bookings for current service provider',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns service bookings for current service provider',
  })
  findMyBookings(@Request() req: AuthenticatedRequest) {
    return this.serviceBookingsService.findByServiceProvider(req.user.userId);
  }

  @Get('customer/my-applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Get service booking applications for current customer listings',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns service bookings for customer listings',
  })
  findMyApplications(@Request() req: AuthenticatedRequest) {
    return this.serviceBookingsService.findByCustomer(req.user.userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Accept or reject service booking (customer only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Service booking status updated',
  })
  @ApiResponse({ status: 404, description: 'Service booking not found' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateServiceBookingStatusDto,
  ) {
    return this.serviceBookingsService.updateStatus(id, updateStatusDto);
  }

  @Post(':id/withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.SERVICE_PROVIDER)
  @ApiOperation({ summary: 'Withdraw service booking (service provider only)' })
  @ApiResponse({
    status: 200,
    description: 'Service booking withdrawn',
  })
  @ApiResponse({ status: 404, description: 'Service booking not found' })
  withdraw(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.serviceBookingsService.withdraw(id, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER, Role.SERVICE_PROVIDER)
  @ApiOperation({ summary: 'Delete a service booking' })
  @ApiResponse({
    status: 200,
    description: 'Service booking deleted',
  })
  @ApiResponse({ status: 404, description: 'Service booking not found' })
  remove(@Param('id') id: string) {
    return this.serviceBookingsService.remove(id);
  }
}
