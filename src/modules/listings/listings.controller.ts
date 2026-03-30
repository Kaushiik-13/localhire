import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import {
  CreateListingInputDto,
  UpdateListingInputDto,
} from './dto/inputs/listing.input.dto';
import {
  ListingOutputDto,
  ListingListOutputDto,
  ListingMessageOutputDto,
} from './dto/outputs/listing.output.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles_decorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { ApprovalStatus } from '../../common/enums/approval.enum';

interface AuthenticatedRequest {
  user: {
    userId: string;
  };
}

@Controller('listings')
@ApiBearerAuth()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER, Role.CUSTOMER)
  @ApiOperation({ summary: 'Create a listing' })
  @ApiResponse({ status: 201, type: ListingOutputDto })
  create(@Body() createListingDto: CreateListingInputDto) {
    return this.listingsService.create(createListingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all listings' })
  @ApiResponse({ type: ListingListOutputDto })
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a listing by ID' })
  @ApiResponse({ type: ListingOutputDto })
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get listings by type' })
  @ApiResponse({ type: ListingListOutputDto })
  findByType(@Param('type') type: string) {
    return this.listingsService.findByType(type);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER, Role.CUSTOMER)
  @ApiOperation({ summary: 'Update a listing' })
  @ApiResponse({ type: ListingOutputDto })
  update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.listingsService.update(id, updateListingDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER, Role.CUSTOMER)
  @ApiOperation({ summary: 'Delete a listing' })
  @ApiResponse({ type: ListingMessageOutputDto })
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.listingsService.remove(id, req.user.userId);
  }

  @Get('admin/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all pending listings (admin only)' })
  @ApiResponse({ type: ListingListOutputDto })
  findPending() {
    return this.listingsService.findByApprovalStatus(ApprovalStatus.PENDING);
  }

  @Get('admin/approved')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all approved listings (admin only)' })
  @ApiResponse({ type: ListingListOutputDto })
  findApproved() {
    return this.listingsService.findByApprovalStatus(ApprovalStatus.APPROVED);
  }

  @Get('admin/rejected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Get all rejected listings (admin only)' })
  @ApiResponse({ type: ListingListOutputDto })
  findRejected() {
    return this.listingsService.findByApprovalStatus(ApprovalStatus.REJECTED);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Approve a listing (admin only)' })
  @ApiResponse({ type: ListingMessageOutputDto })
  approve(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.listingsService.approveListing(id, req.user.userId);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Reject a listing (admin only)' })
  @ApiResponse({ type: ListingMessageOutputDto })
  reject(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.listingsService.rejectListing(id, req.user.userId);
  }
}
