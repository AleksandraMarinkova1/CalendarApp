import { Controller, Post, Body, BadRequestException, Put, Get, UseGuards, Req } from '@nestjs/common';
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
      throw new BadRequestException('Email и password се задолжителни.');
    }
    return await this.authService.login(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // async getProfile(@Req() req: Request & { user: JwtPayload }) {
  //   return this.authService.getProfile(req.user.userId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put('users/change-password')
  // async changePassword(@Req() req: Request & { user: JwtPayload }, @Body() dto: ChangePasswordDto) {
  //   return this.authService.changePassword(req.user.userId, dto);
  // }



}
