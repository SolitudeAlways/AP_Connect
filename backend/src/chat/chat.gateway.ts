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

interface ChatMessage {
  message: string;
  username: string;
  timestamp: Date;
}

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

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
  handleMessage(
    @MessageBody() data: { message: string; username: string },
    @ConnectedSocket() client: Socket
  ) {
    const { message, username } = data;
    
    const chatMessage: ChatMessage = {
      message,
      username,
      timestamp: new Date()
    };
    
    this.server.emit('newMessage', chatMessage);
    console.log(`Новое сообщение от ${username}: ${message}`);
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
