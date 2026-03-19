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
import { CreateAdminDto } from './dto/admin.dto';
import { UpdateAdminDto } from './dto/admin.dto';
import { LoginDto } from './dto/login.dto';
import {
  ForgotPasswordDto,
  VerifyOtpDto,
  ResetPasswordDto,
} from './dto/forgot-password.dto';
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
  @ApiResponse({ status: 201, description: 'First admin created' })
  @ApiResponse({ status: 403, description: 'Admin already exists' })
  async createFirstAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.createFirstAdmin(createAdminDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset OTP via email' })
  @ApiResponse({ status: 200, description: 'OTP sent if email exists' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP for password reset' })
  @ApiResponse({ status: 200, description: 'OTP verified' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      resetPasswordDto.newPassword,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto.phone, loginDto.password);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new admin (admin only)' })
  @ApiResponse({ status: 201, description: 'Admin created' })
  @ApiResponse({ status: 409, description: 'Phone already registered' })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.createAdmin(createAdminDto, req.user.userId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all admins' })
  async getAllAdmins() {
    return this.authService.getAllAdmins();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin by ID (admin only)' })
  @ApiResponse({ status: 200, description: 'Admin details' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async getAdminById(@Param('id') id: string) {
    return this.authService.getAdminById(id);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update admin (admin only)' })
  @ApiResponse({ status: 200, description: 'Admin updated' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiResponse({ status: 403, description: 'Cannot update own account' })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.updateAdmin(id, updateAdminDto, req.user.userId);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles_decorator(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete admin (admin only)' })
  @ApiResponse({ status: 200, description: 'Admin deleted' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiResponse({
    status: 403,
    description: 'Cannot delete own account or last admin',
  })
  async deleteAdmin(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.authService.deleteAdmin(id, req.user.userId);
  }
}
