import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterInputDto } from './dto/inputs/register.input.dto';
import { LoginInputDto } from './dto/inputs/login.input.dto';
import {
  UserForgotPasswordInputDto,
  UserVerifyOtpInputDto,
  UserResetPasswordInputDto,
} from './dto/inputs/forgot-password.input.dto';
import { UpdateProfileInputDto } from './dto/inputs/update-profile.input.dto';
import {
  CreateUserInputDto,
  UpdateUserInputDto,
} from './dto/inputs/user.input.dto';
import { UserOutputDto } from './dto/outputs/user.output.dto';
import { UserLoginOutputDto } from './dto/outputs/user-login.output.dto';
import { UserListOutputDto } from './dto/outputs/user-list.output.dto';
import { UserMessageOutputDto } from './dto/outputs/message.output.dto';
import { VerifyOtpOutputDto } from './dto/outputs/verify-otp.output.dto';
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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    type: RegisterInputDto,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 409,
    type: UserMessageOutputDto,
    description: 'Phone already registered',
  })
  async register(@Body() input: RegisterInputDto) {
    return this.usersService.register(input);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    type: UserLoginOutputDto,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    type: UserMessageOutputDto,
    description: 'Invalid credentials',
  })
  async login(@Body() input: LoginInputDto) {
    return this.usersService.login(input.phone, input.password);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP' })
  @ApiResponse({
    status: 200,
    type: UserMessageOutputDto,
    description: 'OTP sent if email exists',
  })
  async forgotPassword(@Body() input: UserForgotPasswordInputDto) {
    return this.usersService.forgotPassword(input.email);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP for password reset' })
  @ApiResponse({
    status: 200,
    type: VerifyOtpOutputDto,
    description: 'OTP verified',
  })
  @ApiResponse({
    status: 400,
    type: UserMessageOutputDto,
    description: 'Invalid or expired OTP',
  })
  verifyOtp(@Body() input: UserVerifyOtpInputDto) {
    return this.usersService.verifyOtp(input.email, input.otp);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({
    status: 200,
    type: UserMessageOutputDto,
    description: 'Password reset successful',
  })
  @ApiResponse({
    status: 400,
    type: UserMessageOutputDto,
    description: 'Invalid or expired OTP',
  })
  async resetPassword(@Body() input: UserResetPasswordInputDto) {
    return this.usersService.resetPassword(
      input.email,
      input.otp,
      input.newPassword,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get own profile' })
  @ApiResponse({
    status: 200,
    type: UserOutputDto,
    description: 'User profile',
  })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update own profile' })
  @ApiResponse({
    status: 200,
    type: UserOutputDto,
    description: 'Profile updated',
  })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() input: UpdateProfileInputDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, input);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user (admin only)' })
  @ApiResponse({
    status: 201,
    type: UserMessageOutputDto,
    description: 'User created',
  })
  @ApiResponse({
    status: 409,
    type: UserMessageOutputDto,
    description: 'Phone already registered',
  })
  async createUser(
    @Body() input: CreateUserInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.usersService.createByAdmin(input, req.user.userId);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search users by name/phone (for report against entity)',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search query (name or phone)',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description:
      'Filter by role (worker, employer, service_provider, customer)',
  })
  async searchUsers(@Query('q') query: string, @Query('role') role?: string) {
    return this.usersService.search(query, role);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({
    status: 200,
    type: UserListOutputDto,
    description: 'List of users',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({
    status: 200,
    type: UserOutputDto,
    description: 'User details',
  })
  @ApiResponse({
    status: 404,
    type: UserMessageOutputDto,
    description: 'User not found',
  })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiResponse({
    status: 200,
    type: UserMessageOutputDto,
    description: 'User updated',
  })
  @ApiResponse({
    status: 404,
    type: UserMessageOutputDto,
    description: 'User not found',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.usersService.updateByAdmin(id, input, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user (admin only)' })
  @ApiResponse({
    status: 200,
    type: UserMessageOutputDto,
    description: 'User deleted',
  })
  @ApiResponse({
    status: 404,
    type: UserMessageOutputDto,
    description: 'User not found',
  })
  async deleteUser(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.usersService.deleteByAdmin(id, req.user.userId);
  }
}
