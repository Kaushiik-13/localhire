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
import { EmployersService } from './employers.service';
import { CreateEmployerInputDto } from './dto/inputs/employer.input.dto';
import { UpdateEmployerInputDto } from './dto/inputs/employer.input.dto';
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

@Controller('employers')
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an employer profile' })
  @ApiResponse({ status: 201, description: 'Employer created successfully' })
  @ApiResponse({
    status: 400,
    description: 'User not found or not an employer',
  })
  @ApiResponse({ status: 409, description: 'Employer profile already exists' })
  create(
    @Body() createEmployerDto: CreateEmployerInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.employersService.create(createEmployerDto, req.user.userId);
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
