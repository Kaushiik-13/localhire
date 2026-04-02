import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
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
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAdminInputDto } from './dto/inputs/admin.input.dto';
import { UpdateAdminInputDto } from './dto/inputs/admin.input.dto';
import { LoginInputDto } from './dto/inputs/login.input.dto';
import { CreateBulkUserDto } from './dto/inputs/bulk-create-users.input.dto';
import {
  AuthForgotPasswordInputDto,
  AuthVerifyOtpInputDto,
  AuthResetPasswordInputDto,
} from './dto/inputs/forgot-password.input.dto';
import { AdminOutputDto } from './dto/outputs/admin.output.dto';
import { AdminLoginOutputDto } from './dto/outputs/admin-login.output.dto';
import { AdminListOutputDto } from './dto/outputs/admin-list.output.dto';
import { AuthMessageOutputDto } from './dto/outputs/message.output.dto';
import { VerifyOtpOutputDto } from './dto/outputs/verify-otp.output.dto';
import { BulkCreateUsersOutputDto } from './dto/outputs/bulk-create-users.output.dto';
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

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('first-admin')
  @ApiOperation({ summary: 'Create first admin (only when no admins exist)' })
  @ApiResponse({
    status: 201,
    type: AdminLoginOutputDto,
    description: 'First admin created',
  })
  @ApiResponse({
    status: 403,
    type: AuthMessageOutputDto,
    description: 'Admin already exists',
  })
  async createFirstAdmin(@Body() input: CreateAdminInputDto) {
    return this.authService.createFirstAdmin(input);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP via email' })
  @ApiResponse({
    status: 200,
    type: AuthMessageOutputDto,
    description: 'OTP sent if email exists',
  })
  async forgotPassword(@Body() input: AuthForgotPasswordInputDto) {
    return this.authService.forgotPassword(input.email);
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
    type: AuthMessageOutputDto,
    description: 'Invalid or expired OTP',
  })
  verifyOtp(@Body() input: AuthVerifyOtpInputDto) {
    return this.authService.verifyOtp(input.email, input.otp);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({
    status: 200,
    type: AuthMessageOutputDto,
    description: 'Password reset successful',
  })
  @ApiResponse({
    status: 400,
    type: AuthMessageOutputDto,
    description: 'Invalid or expired OTP',
  })
  async resetPassword(@Body() input: AuthResetPasswordInputDto) {
    return this.authService.resetPassword(
      input.email,
      input.otp,
      input.newPassword,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: 200,
    type: AdminLoginOutputDto,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    type: AuthMessageOutputDto,
    description: 'Invalid credentials',
  })
  async adminLogin(@Body() input: LoginInputDto) {
    return this.authService.adminLogin(input.phone, input.password);
  }

  @Get('admin-roles')
  @ApiOperation({ summary: 'Get all admin roles' })
  @ApiResponse({
    status: 200,
    type: AdminListOutputDto,
    description: 'List of all admin roles',
  })
  async getAllAdminRoles() {
    return this.authService.getAllAdmins();
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new admin (admin only)' })
  @ApiResponse({
    status: 201,
    type: AuthMessageOutputDto,
    description: 'Admin created',
  })
  @ApiResponse({
    status: 409,
    type: AuthMessageOutputDto,
    description: 'Phone already registered',
  })
  async createAdmin(
    @Body() input: CreateAdminInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.createAdmin(input, req.user.userId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins (admin only)' })
  @ApiResponse({
    status: 200,
    type: AdminListOutputDto,
    description: 'List of all admins',
  })
  async getAllAdmins() {
    return this.authService.getAllAdmins();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin by ID (admin only)' })
  @ApiResponse({
    status: 200,
    type: AdminOutputDto,
    description: 'Admin details',
  })
  @ApiResponse({
    status: 404,
    type: AuthMessageOutputDto,
    description: 'Admin not found',
  })
  async getAdminById(@Param('id') id: string) {
    return this.authService.getAdminById(id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin (admin only)' })
  @ApiResponse({
    status: 200,
    type: AuthMessageOutputDto,
    description: 'Admin updated',
  })
  @ApiResponse({
    status: 404,
    type: AuthMessageOutputDto,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: 403,
    type: AuthMessageOutputDto,
    description: 'Cannot update own account',
  })
  async updateAdmin(
    @Param('id') id: string,
    @Body() input: UpdateAdminInputDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.updateAdmin(id, input, req.user.userId);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete admin (admin only)' })
  @ApiResponse({
    status: 200,
    type: AuthMessageOutputDto,
    description: 'Admin deleted',
  })
  @ApiResponse({
    status: 404,
    type: AuthMessageOutputDto,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: 403,
    type: AuthMessageOutputDto,
    description: 'Cannot delete own account or last admin',
  })
  async deleteAdmin(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.deleteAdmin(id, req.user.userId);
  }

  @Post('bulk-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk create users (admin only)' })
  @ApiResponse({
    status: 201,
    type: BulkCreateUsersOutputDto,
    description: 'Bulk user creation completed',
  })
  @ApiResponse({
    status: 401,
    type: AuthMessageOutputDto,
    description: 'Unauthorized',
  })
  async bulkCreateUsers(
    @Body() users: CreateBulkUserDto[],
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.bulkCreateUsers(users, req.user.userId);
  }
}
