import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

interface ChatMessage {
  message: string;
  username: string;
  timestamp: Date;
}

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173", // Подключение только с фронта
    credentials: true // разрешаем передачу токенов
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server; // управление всеми соединениями

  private connectedUsers = new Map<string, string>(); // id клиента и имя пользователя

  handleConnection(client: Socket) {
    console.log(`Клиент подключился: ${client.id}`);
    this.server.emit('userList', Array.from(this.connectedUsers.values()));
  }

  handleDisconnect(client: Socket) {
    console.log(`Клиент отключился: ${client.id}`);
    
    const username = this.connectedUsers.get(client.id);
    if (username) {
      this.connectedUsers.delete(client.id);
      this.server.emit('userLeft', username);
      this.server.emit('userList', Array.from(this.connectedUsers.values()));
    }
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket
  ) {
    const { username } = data;
    this.connectedUsers.set(client.id, username);
    this.server.emit('userJoined', username);
    this.server.emit('userList', Array.from(this.connectedUsers.values()));
    console.log(`Пользователь ${username} присоединился к чату`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { message: string; username: string; userId?: number },
    @ConnectedSocket() client: Socket
    
  ) {
    console.log('handleMessage вызван', data);
    const { message, username, userId } = data;
    
    // Сохраняем сообщение в базу данных
    const savedMessage = await this.chatService.createMessage({
      content: message,
      username,
      userId: userId || undefined // Если userId не передан, передаем undefined
    });
    
    const chatMessage: ChatMessage = {
      message,
      username,
      timestamp: new Date()
    };
    this.connectedUsers.set(client.id, username);
    this.server.emit('newMessage', chatMessage);
    console.log(`Новое сообщение от ${username}: ${message}`);
  }

  @SubscribeMessage('getHistory')
  async handleGetHistory(@ConnectedSocket() client: Socket) {
    try {
      const messages = await this.chatService.getRecentMessages(50);
      client.emit('chatHistory', messages);
      console.log(`Отправлена история чата клиенту ${client.id}`);
    } catch (error) {
      console.error('Ошибка при получении истории чата:', error);
      client.emit('error', 'Не удалось загрузить историю чата');
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { username: string; isTyping: boolean },
    @ConnectedSocket() client: Socket
  ) {
    const { username, isTyping } = data;
    client.broadcast.emit('userTyping', { username, isTyping });
  }
}
