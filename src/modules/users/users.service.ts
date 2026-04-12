import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../schemas/user.schema';
import { Role } from '../../common/enums/roles.enum';
import { UserStatus } from '../../common/enums/status.enum';
import { EmailService } from '../email/email.service';
import { RegisterInputDto } from './dto/inputs/register.input.dto';
import { CreateUserInputDto } from './dto/inputs/user.input.dto';
import { UpdateUserInputDto } from './dto/inputs/user.input.dto';
import { UpdateProfileInputDto } from './dto/inputs/update-profile.input.dto';

interface OtpEntry {
  otp: string;
  expiresAt: Date;
  attempts: number;
}

@Injectable()
export class UsersService {
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

  async register(input: RegisterInputDto) {
    const existingUser = await this.userModel.findOne({ phone: input.phone });
    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = new this.userModel({
      name: input.name,
      phone: input.phone,
      email: input.email,
      password_hash: passwordHash,
      profile_photo: input.profile_photo,
      language: input.language || 'en',
      is_phone_verified: false,
      status: input.status || UserStatus.ACTIVE,
      roles: input.roles || [Role.CUSTOMER],
      approval_status: input.approval_status,
      addresses: input.addresses || [],
      identity_docs: input.identity_docs || [],
    });

    await user.save();

    const token = this.generateToken(user);

    return {
      message: 'User registered successfully',
      user: this.sanitizeUser(user),
      access_token: token,
    };
  }

  async login(phone: string, password: string) {
    const user = await this.userModel.findOne({ phone });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      access_token: token,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return {
        message:
          'If a user account exists with this email, an OTP has been sent.',
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
        'If a user account exists with this email, an OTP has been sent.',
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
    return { message: 'OTP verified successfully', valid: true };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const entry = this.otpStore.get(email.toLowerCase());
    if (!entry || entry.otp !== otp || entry.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      password_hash: passwordHash,
    });
    this.otpStore.delete(email.toLowerCase());

    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInputDto) {
    const updateData: Record<string, unknown> = {};
    if (input.name) updateData.name = input.name;
    if (input.email) updateData.email = input.email;
    if (input.profile_photo) updateData.profile_photo = input.profile_photo;
    if (input.language) updateData.language = input.language;
    if (input.addresses) updateData.addresses = input.addresses;

    const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitizeUser(user);
  }

  async createByAdmin(input: CreateUserInputDto, adminId: string) {
    const existingUser = await this.userModel.findOne({ phone: input.phone });
    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = new this.userModel({
      name: input.name,
      phone: input.phone,
      email: input.email,
      password_hash: passwordHash,
      roles: input.roles || [Role.CUSTOMER],
      status: input.status || UserStatus.ACTIVE,
      approved_by: new Types.ObjectId(adminId),
    });

    await user.save();
    return {
      message: 'User created successfully',
      user: this.sanitizeUser(user),
    };
  }

  async findAll() {
    const users = await this.userModel
      .find({ roles: { $ne: 'admin' } })
      .select('-password_hash')
      .sort({ createdAt: -1 });
    return {
      count: users.length,
      users: users.map((u) => this.sanitizeUser(u)),
    };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid ID');
    }
    const user = await this.userModel.findById(id).select('-password_hash');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitizeUser(user);
  }

  async search(query: string, role?: string) {
    const filter: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    };
    if (role) {
      filter.roles = role;
    }
    const users = await this.userModel
      .find(filter)
      .select('_id name phone roles')
      .limit(20);
    return users;
  }

  async updateByAdmin(id: string, input: UpdateUserInputDto, adminId: string) {
    if (id === adminId) {
      throw new ForbiddenException('Cannot update your own account');
    }

    const updateData: Record<string, unknown> = {};
    if (input.name) updateData.name = input.name;
    if (input.email) updateData.email = input.email;
    if (input.status) updateData.status = input.status;
    if (input.roles) updateData.roles = input.roles;
    if (input.approval_status)
      updateData.approval_status = input.approval_status;

    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password_hash');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User updated successfully',
      user: this.sanitizeUser(user),
    };
  }

  async deleteByAdmin(id: string, adminId: string) {
    if (id === adminId) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  private generateToken(user: UserDocument): string {
    const payload = { sub: user._id, phone: user.phone, roles: user.roles };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: UserDocument) {
    const obj = user.toObject() as {
      createdAt: Date;
      updatedAt: Date;
    };
    return {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      profile_photo: user.profile_photo,
      language: user.language,
      is_phone_verified: user.is_phone_verified,
      status: user.status,
      roles: user.roles,
      approval_status: user.approval_status,
      addresses: user.addresses,
      identity_docs: user.identity_docs,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }
}
