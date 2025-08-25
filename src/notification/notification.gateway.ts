import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
@WebSocketGateway({
  cors: { origin: '*' }, // تنظیم برای کلاینت‌ها
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    try {
      const payload = this.jwtService.verify(token);

      const userId = payload.userId;
      client.data.userId = userId;
      client.join(userId);
      console.log(`User ${userId} connected`);
    } catch (err) {
      client.disconnect();
      console.log('Invalid token, client disconnected');
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendToUser(userId: string, payload: any) {
    this.server.to(userId).emit('newNotification', payload);
  }
}
