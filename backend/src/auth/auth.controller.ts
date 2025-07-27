import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Put,
  Get,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/changePw.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuthGuard';

interface JwtPayload {
  userId: number;
  email: string;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }
    return await this.authService.login(dto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; oldPassword: string; newPassword: string }
  ) {
    console.log('BODY', body);

    return this.authService.resetPasswordWithEmail(
      body.email,
      body.oldPassword,
      body.newPassword
    );
  }

  @Get('profile')
  async getProfile(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    return this.authService.getProfileById(Number(userId));
  }
}
