import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

 @Post('register')
async register(@Body() createUserDto: CreateUserDto): Promise<{ id: number; email: string }> {
  // Проверяем, существует ли пользователь с таким email
  const existingUserByEmail = await this.userService.findByEmail(createUserDto.email);
  if (existingUserByEmail) {
    throw new UnauthorizedException('Пользователь с таким email уже существует');
  }

  // Проверяем, существует ли пользователь с таким login
  const existingUserByLogin = await this.userService.findByLogin(createUserDto.login);
  if (existingUserByLogin) {
    throw new UnauthorizedException('Пользователь с таким логином уже существует');
  }

  const user = await this.userService.create(createUserDto);
  return { id: user.id, email: user.email };
}


@Post('login')
async login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token: string, username: string, userId: number }> {
  const user = await this.userService.findByEmail(loginUserDto.email);
  if (!user) {
    throw new UnauthorizedException('Пользователь не найден');
  }
  const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Неверный пароль');
  }

  const payload = { sub: user.id, email: user.email };
  const token = this.jwtService.sign(payload);

  return { access_token: token, username: user.login, userId: user.id };
}
}
