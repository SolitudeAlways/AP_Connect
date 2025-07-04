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
  const user = await this.userService.create(createUserDto);
  return { id: user.id, email: user.email };
}


  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
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

    return { access_token: token };
  }
}
