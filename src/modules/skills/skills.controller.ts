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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/create-skill.dto';
import { CreateBulkSkillDto } from './dto/bulk-create-skills.dto';
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

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill (admin only)' })
  @ApiResponse({
    status: 201,
    type: CreateSkillDto,
    description: 'Skill created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Skill name already exists',
  })
  create(
    @Body() createSkillDto: CreateSkillDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.skillsService.create(createSkillDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({
    status: 200,
    description: 'List of all skills',
  })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({
    status: 200,
    description: 'Skill details',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update skill (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Skill updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Skill name already exists',
  })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete skill (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Skill deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Skill not found',
  })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk create skills (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Bulk skill creation completed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async bulkCreateSkills(
    @Body() skills: CreateBulkSkillDto[],
    @Request() req: AuthenticatedRequest,
  ) {
    return this.skillsService.bulkCreateSkills(skills, req.user.userId);
  }
}
