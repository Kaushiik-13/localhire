import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerInputDto } from './dto/inputs/worker.input.dto';
import { UpdateWorkerInputDto } from './dto/inputs/worker.input.dto';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  create(@Body() createWorkerDto: CreateWorkerInputDto) {
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  findAll() {
    return this.workersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.workersService.findByUserId(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkerDto: UpdateWorkerInputDto,
  ) {
    return this.workersService.update(id, updateWorkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workersService.remove(id);
  }
}
