import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { CreateServiceProviderInputDto } from './dto/inputs/service-provider.input.dto';
import { UpdateServiceProviderInputDto } from './dto/inputs/service-provider.input.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a service provider' })
  @ApiResponse({ status: 201, type: CreateServiceProviderInputDto })
  create(@Body() createServiceProviderDto: CreateServiceProviderInputDto) {
    return this.serviceProvidersService.create(createServiceProviderDto);
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
