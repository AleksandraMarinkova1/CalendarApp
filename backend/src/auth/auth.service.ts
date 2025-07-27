import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';


// eslint-disable-next-line @nx/enforce-module-boundaries
import { hash, compare } from 'bcryptjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/changePw.dto';


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) { }

  async register({ email, password, firstName, lastName }: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new BadRequestException('Корисник веќе постои');

    const hashed = await hash(password, 10);

    await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
      },
    });

    return { message: 'Успешно регистриран' };
  }


  async login({ email, password }: LoginDto) {
    console.log('Login attempt with email:', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`User with email ${email} not found`);
      throw new BadRequestException('Неправилен email или лозинка');
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password for user:', email);
      throw new BadRequestException('Неправилен email или лозинка');
    }

    // Ако е успешен
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    return { token };
  }
  



// async changePassword(userId: number, dto: ChangePasswordDto) {
//   console.log('DTO:', dto, 'userId:', userId);

//   // 1. Најди го корисникот
//   const user = await this.prisma.user.findUnique({ where: { id: userId } });
//   if (!user) {
//     throw new BadRequestException('Корисникот не е пронајден');
//   }

//   // 2. Провери дали старата лозинка е точна
//   const isMatch = await compare(dto.currentPassword, user.password);
//   if (!isMatch) {
//     throw new BadRequestException('Старата лозинка е неточна');
//   }

//   // 3. Хаширај ја новата лозинка
//   const hashedPassword = await hash(dto.newPassword, 10);

//   // 4. Ажурирај го корисникот
//   await this.prisma.user.update({
//     where: { id: userId },
//     data: { password: hashedPassword },
//   });

//   console.log('Password changed successfully for user:', userId);

//   return { message: 'Лозинката е успешно променета' };
// }


}
