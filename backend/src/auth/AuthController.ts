import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './AuthService';
import { UserService } from '../user/user.service'; // Импортируй UserService
import { JwtService } from '@nestjs/jwt';      
import * as bcrypt from 'bcrypt';     // Импортируй JwtService

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,   // Внедри UserService
    private readonly jwtService: JwtService      // Внедри JwtService
  ) {}

  @Post('login')
async login(@Body() body: { email: string; password: string }) {
  const user = await this.userService.findByEmail(body.email);
  if (!user) {
    throw new UnauthorizedException('Пользователь не найден');
  }
  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Неверный пароль');
  }
  const payload = { sub: user.id, email: user.email };
  const token = this.jwtService.sign(payload);

  return { access_token: token, username: user.login };
}
}