import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { hash, compare } from 'bcryptjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register({ email, password, firstName, lastName }: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('User already exists');

    const hashed = await hash(password, 10);

    await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
      },
    });

    return { message: 'You have successfully signed up' };
  }

  async login({ email, password }: LoginDto) {
    console.log('Login attempt with email:', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`User with email ${email} not found`);
      throw new BadRequestException('Wrong email or password');
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password for user:', email);
      throw new BadRequestException('Wrong email or password');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    return { token };
  }

  async resetPasswordWithEmail(
    email: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password is incorrect');

    const hashed = await hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    return { message: 'Password updated successfully' };
  }

  async getProfileById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      console.log('not found');
    }

    return user;
  }
}
