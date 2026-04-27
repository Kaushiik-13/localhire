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
  CreateDirectBookingDto,
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
    roles?: string[];
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
  create(
    @Body() createServiceBookingDto: CreateServiceBookingDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceBookingsService.create(
      createServiceBookingDto,
      req.user.userId,
    );
  }

  @Post('direct')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Create a direct booking with a service provider',
  })
  @ApiResponse({
    status: 201,
    description: 'Direct booking created successfully',
  })
  @ApiResponse({ status: 404, description: 'Service provider not found' })
  @ApiResponse({ status: 400, description: 'Service provider is not active' })
  createDirect(
    @Body() dto: CreateDirectBookingDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceBookingsService.createDirect(req.user.userId, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get a single booking by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the booking details',
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  getById(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceBookingsService.findById(
      id,
      req.user.userId,
      req.user.roles || [],
    );
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get service bookings by listing ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns service bookings for a listing',
  })
  @ApiResponse({ status: 403, description: 'Only the listing owner can view bookings' })
  findByListing(
    @Param('listingId') listingId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceBookingsService.findByListing(listingId, req.user.userId);
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
  @ApiResponse({ status: 404, description: 'Service provider profile not found' })
  findMyBookings(@Request() req: AuthenticatedRequest) {
    return this.serviceBookingsService.findByServiceProviderUserId(req.user.userId);
  }

  @Get('customer/my-bookings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Get all bookings initiated by the current customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all bookings for the current customer',
  })
  findMyBookingsCustomer(@Request() req: AuthenticatedRequest) {
    return this.serviceBookingsService.findByCustomer(req.user.userId);
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
  @Roles_decorator(Role.CUSTOMER, Role.SERVICE_PROVIDER, Role.WORKER)
  @ApiOperation({
    summary: 'Accept or reject service booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Service booking status updated',
  })
  @ApiResponse({ status: 404, description: 'Service booking not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateServiceBookingStatusDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceBookingsService.updateStatus(id, updateStatusDto, req.user.userId, req.user.roles || []);
  }

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Mark booking as completed (customer or provider)',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking marked as completed',
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Booking must be accepted before completing' })
  @ApiResponse({ status: 403, description: 'Only the customer or provider can complete' })
  complete(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceBookingsService.complete(id, req.user.userId);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Cancel a booking (customer only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Cannot cancel a completed or cancelled booking' })
  @ApiResponse({ status: 403, description: 'Only the customer can cancel' })
  cancel(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.serviceBookingsService.cancel(id, req.user.userId);
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
  @ApiResponse({ status: 403, description: 'Only the customer or involved service provider can delete this booking' })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.serviceBookingsService.remove(id, req.user.userId);
  }
}
