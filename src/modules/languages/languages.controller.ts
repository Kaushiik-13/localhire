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
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/create-language.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles_decorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticatedRequest {
  user: {
    userId: string;
    phone: string;
    roles: string[];
  };
}

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new language (admin only)' })
  @ApiResponse({
    status: 201,
    type: CreateLanguageDto,
    description: 'Language created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Language name already exists',
  })
  create(
    @Body() createLanguageDto: CreateLanguageDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.languagesService.create(createLanguageDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  @ApiResponse({
    status: 200,
    description: 'List of all languages',
  })
  findAll() {
    return this.languagesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active languages' })
  @ApiResponse({
    status: 200,
    description: 'List of active languages',
  })
  findActive() {
    return this.languagesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get language by ID' })
  @ApiResponse({
    status: 200,
    description: 'Language details',
  })
  @ApiResponse({
    status: 404,
    description: 'Language not found',
  })
  findOne(@Param('id') id: string) {
    return this.languagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update language (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Language updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Language not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Language name already exists',
  })
  update(
    @Param('id') id: string,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languagesService.update(id, updateLanguageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete language (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Language deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Language not found',
  })
  remove(@Param('id') id: string) {
    return this.languagesService.remove(id);
  }
}
