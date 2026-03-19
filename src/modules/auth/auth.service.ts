import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../schemas/user.schema';
import { Role } from '../../common/enums/roles.enum';
import { UserStatus } from '../../common/enums/status.enum';
import { Types } from 'mongoose';
import { CreateAdminDto } from './dto/admin.dto';
import { UpdateAdminDto } from './dto/admin.dto';
import { EmailService } from '../email/email.service';

interface OtpEntry {
  otp: string;
  expiresAt: Date;
  attempts: number;
}

@Injectable()
export class AuthService {
  private otpStore: Map<string, OtpEntry> = new Map();

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {
    setInterval(() => this.cleanExpiredOtps(), 60000);
  }

  private cleanExpiredOtps() {
    const now = new Date();
    for (const [email, entry] of this.otpStore.entries()) {
      if (entry.expiresAt < now) {
        this.otpStore.delete(email);
      }
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async forgotPassword(email: string) {
    const admin = await this.userModel.findOne({
      email,
      roles: { $in: [Role.ADMIN] },
    });

    if (!admin) {
      return {
        message:
          'If an admin account exists with this email, an OTP has been sent.',
      };
    }

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    this.otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt,
      attempts: 0,
    });

    await this.emailService.sendOtpEmail(email, otp);

    return {
      message:
        'If an admin account exists with this email, an OTP has been sent.',
    };
  }

  verifyOtp(email: string, otp: string) {
    const entry = this.otpStore.get(email.toLowerCase());

    if (!entry) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (entry.expiresAt < new Date()) {
      this.otpStore.delete(email.toLowerCase());
      throw new BadRequestException('OTP has expired');
    }

    if (entry.otp !== otp) {
      entry.attempts += 1;
      if (entry.attempts >= 3) {
        this.otpStore.delete(email.toLowerCase());
        throw new BadRequestException(
          'Too many attempts. Please request a new OTP.',
        );
      }
      throw new BadRequestException('Invalid OTP');
    }

    return {
      message: 'OTP verified successfully',
      valid: true,
    };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const entry = this.otpStore.get(email.toLowerCase());

    if (!entry || entry.otp !== otp || entry.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const admin = await this.userModel.findOne({
      email,
      roles: { $in: [Role.ADMIN] },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(admin._id, {
      password_hash: passwordHash,
    });

    this.otpStore.delete(email.toLowerCase());

    return {
      message: 'Password reset successfully',
    };
  }

  async createFirstAdmin(createAdminDto: CreateAdminDto) {
    const adminCount = await this.userModel.countDocuments({
      roles: { $in: [Role.ADMIN] },
    });

    if (adminCount > 0) {
      throw new ForbiddenException(
        'First admin already exists. Use admin login to create more.',
      );
    }

    const passwordHash = await bcrypt.hash(createAdminDto.password, 10);

    const admin = new this.userModel({
      name: createAdminDto.name,
      phone: createAdminDto.phone,
      email: createAdminDto.email,
      password_hash: passwordHash,
      roles: [Role.ADMIN],
      status: UserStatus.ACTIVE,
      is_phone_verified: true,
    });

    await admin.save();

    const token = this.generateToken(admin);

    return {
      message: 'First admin created successfully',
      admin: this.sanitizeAdmin(admin),
      access_token: token,
    };
  }

  async adminLogin(phone: string, password: string) {
    const admin = await this.userModel.findOne({
      phone,
      roles: { $in: [Role.ADMIN] },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (admin.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Your account is not active');
    }

    const token = this.generateToken(admin);

    return {
      message: 'Login successful',
      admin: this.sanitizeAdmin(admin),
      access_token: token,
    };
  }

  async createAdmin(createAdminDto: CreateAdminDto, requestingAdminId: string) {
    const existingUser = await this.userModel.findOne({
      phone: createAdminDto.phone,
    });

    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(createAdminDto.password, 10);

    const admin = new this.userModel({
      name: createAdminDto.name,
      phone: createAdminDto.phone,
      email: createAdminDto.email,
      password_hash: passwordHash,
      roles: [Role.ADMIN],
      status: UserStatus.ACTIVE,
      is_phone_verified: true,
    });

    if (requestingAdminId) {
      admin.approved_by = new Types.ObjectId(requestingAdminId);
    }

    await admin.save();

    return {
      message: 'Admin created successfully',
      admin: this.sanitizeAdmin(admin),
    };
  }

  async getAllAdmins() {
    const admins = await this.userModel
      .find({ roles: { $in: [Role.ADMIN] } })
      .select('-password_hash')
      .sort({ createdAt: -1 });

    return {
      count: admins.length,
      admins,
    };
  }

  async getAdminById(id: string) {
    const admin = await this.userModel
      .findOne({ _id: id, roles: { $in: [Role.ADMIN] } })
      .select('-password_hash');

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async updateAdmin(
    id: string,
    updateAdminDto: UpdateAdminDto,
    requestingAdminId: string,
  ) {
    if (id === requestingAdminId) {
      throw new ForbiddenException('Cannot update your own account');
    }

    const admin = await this.userModel.findOne({
      _id: id,
      roles: { $in: [Role.ADMIN] },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const updateData: {
      name?: string;
      email?: string;
      password_hash?: string;
      status?: string;
    } = {};

    if (updateAdminDto.name) {
      updateData.name = updateAdminDto.name;
    }

    if (updateAdminDto.email) {
      updateData.email = updateAdminDto.email;
    }

    if (updateAdminDto.password) {
      updateData.password_hash = await bcrypt.hash(updateAdminDto.password, 10);
    }

    if (updateAdminDto.status) {
      updateData.status = updateAdminDto.status;
    }

    const updatedAdmin = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password_hash');

    return {
      message: 'Admin updated successfully',
      admin: updatedAdmin,
    };
  }

  async deleteAdmin(id: string, requestingAdminId: string) {
    if (id === requestingAdminId) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    const admin = await this.userModel.findOne({
      _id: id,
      roles: { $in: [Role.ADMIN] },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const adminCount = await this.userModel.countDocuments({
      roles: { $in: [Role.ADMIN] },
    });

    if (adminCount <= 1) {
      throw new ForbiddenException('Cannot delete the last admin');
    }

    await this.userModel.findByIdAndDelete(id);

    return {
      message: 'Admin deleted successfully',
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = { sub: user._id, phone: user.phone, roles: user.roles };
    return this.jwtService.sign(payload);
  }

  private sanitizeAdmin(user: UserDocument) {
    const userObj = user.toObject() as {
      name: string;
      phone: string;
      email?: string;
      roles: Role[];
      status: string;
      createdAt: Date;
    };
    return {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      roles: user.roles,
      status: user.status,
      createdAt: userObj.createdAt,
    };
  }
}
