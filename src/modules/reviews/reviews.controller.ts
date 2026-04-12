import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewInputDto } from './dto/inputs/create-review.input.dto';
import {
  ReviewOutputDto,
  ReviewListOutputDto,
  ReviewMessageOutputDto,
} from './dto/outputs/review.output.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles_decorator } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

interface AuthenticatedRequest {
  user: {
    userId: string;
  };
}

@Controller('reviews')
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER, Role.WORKER)
  @ApiOperation({ summary: 'Create a review for a job application' })
  @ApiResponse({ status: 201, type: ReviewOutputDto })
  create(
    @Body() createReviewDto: CreateReviewInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.EMPLOYER, Role.WORKER)
  @ApiOperation({ summary: 'Get reviews about the logged-in user' })
  @ApiResponse({ status: 200, type: ReviewListOutputDto })
  findMyReviews(@Request() req: AuthenticatedRequest) {
    return this.reviewsService.findMyReviews(req.user.userId);
  }

  @Get('profile/:userId')
  @ApiOperation({
    summary: 'Get reviews about a user by their user ID (public)',
  })
  @ApiResponse({ status: 200, type: ReviewListOutputDto })
  findByUserId(@Param('userId') userId: string) {
    return this.reviewsService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({ status: 200, type: ReviewOutputDto })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a review (admin only)' })
  @ApiResponse({ status: 200, type: ReviewMessageOutputDto })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
