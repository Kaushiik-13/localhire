import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceBookingsService } from './service-bookings.service';
import { CreateServiceBookingDto } from './dto/create-service-booking.dto';
import { UpdateServiceBookingDto } from './dto/create-service-booking.dto';

@Controller('service-bookings')
export class ServiceBookingsController {
  constructor(
    private readonly serviceBookingsService: ServiceBookingsService,
  ) {}

  @Post()
  create(@Body() createServiceBookingDto: CreateServiceBookingDto) {
    return this.serviceBookingsService.create(createServiceBookingDto);
  }

  @Get()
  findAll() {
    return this.serviceBookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceBookingsService.findOne(id);
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId') customerId: string) {
    return this.serviceBookingsService.findByCustomer(customerId);
  }

  @Get('worker/:workerId')
  findByWorker(@Param('workerId') workerId: string) {
    return this.serviceBookingsService.findByWorker(workerId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateServiceBookingDto: UpdateServiceBookingDto,
  ) {
    return this.serviceBookingsService.update(id, updateServiceBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceBookingsService.remove(id);
  }
}
