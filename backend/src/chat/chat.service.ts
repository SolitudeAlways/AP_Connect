 import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Найти пользователя по username
  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login: username } });
  }

  // Создать новое сообщение
  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    console.log('Сохраняем сообщение:', createMessageDto);
    
    // Если userId не передан или равен 0, ищем пользователя по username
    if (!createMessageDto.userId || createMessageDto.userId === 0) {
      const user = await this.findUserByUsername(createMessageDto.username);
      if (user) {
        createMessageDto.userId = user.id;
        console.log(`Найден пользователь ${createMessageDto.username} с ID: ${user.id}`);
      } else {
        console.warn(`Пользователь ${createMessageDto.username} не найден в базе данных`);
        // Удаляем userId, чтобы сохранить сообщение без связи с пользователем
        delete createMessageDto.userId;
      }
    }
    
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  // Получить все сообщения (для истории)
  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({
      order: { createdAt: 'ASC' },
      relations: ['user']
    });
  }

  // Получить последние N сообщений
  async getRecentMessages(limit: number = 50): Promise<Message[]> {
    return this.messageRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['user']
    });
  }
}