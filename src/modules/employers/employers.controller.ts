import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployersService } from './employers.service';
import { CreateEmployerInputDto } from './dto/inputs/employer.input.dto';
import { UpdateEmployerInputDto } from './dto/inputs/employer.input.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('employers')
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an employer' })
  @ApiResponse({ status: 201, type: CreateEmployerInputDto })
  create(@Body() createEmployerDto: CreateEmployerInputDto) {
    return this.employersService.create(createEmployerDto);
  }

  @Get()
  findAll() {
    return this.employersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.employersService.findByUserId(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployerDto: UpdateEmployerInputDto,
  ) {
    return this.employersService.update(id, updateEmployerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employersService.remove(id);
  }
}
