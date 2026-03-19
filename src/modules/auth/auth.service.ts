import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      phone: registerDto.phone,
    });
    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = new this.userModel({
      ...registerDto,
      password_hash: passwordHash,
      roles: registerDto.roles || [],
    });

    await user.save();

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        roles: user.roles,
      },
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ phone: loginDto.phone });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        roles: user.roles,
      },
      access_token: token,
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = { sub: user._id, phone: user.phone, roles: user.roles };
    return this.jwtService.sign(payload);
  }
}
