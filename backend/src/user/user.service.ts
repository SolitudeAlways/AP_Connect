import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Создание пользователя с хешированием пароля
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, login, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10); // Хешируем пароль
    const user = this.userRepository.create({
      email,
      login,
      password: hashedPassword,
    });
    return this.userRepository.save(user); // Сохраняем пользователя в базу
  }

  // Получить всех пользователей
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Найти пользователя по id
  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  // Найти пользователя по email (например, для логина)
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }
  // Нахождение пользоватля по логину
  findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOneBy({ login });
  }

  // Удалить пользователя
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}