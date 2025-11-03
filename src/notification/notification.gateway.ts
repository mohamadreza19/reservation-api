import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationEvent } from 'src/common/enums/notification-event.enum';
import { NotificationService } from './notification.service';
import { NotificationStatus } from 'src/common/enums/notification-status.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
    private readonly notificationS: NotificationService,
  ) {
    this.eventEmitter.on(
      NotificationStatus.UN_READ,
      ({ userId, notification }) => {
        this.sendUnRead(userId, notification);
      },
    );
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.userId;
      client.data.userId = userId;
      client.join(userId);

      console.log(`User ${userId} connected`);

      // 1️⃣ Send unread notifications immediately on connection
      const unreadNotifications =
        await this.notificationS.findUnreadByUserId(userId);

      this.sendUnRead(userId, unreadNotifications);

      // 2️⃣ Handle marking notifications as read
      // client.on(
      //   NotificationStatus.MARK_AS_READ,
      //   async (data: { notificationId: string }) => {
      //     console.log('Client marked notification as read:', data);

      //     const updated = await this.notificationS.markAsRead(
      //       data.notificationId,
      //       userId,
      //     );

      //     // Optionally notify the client that the notification is marked as read
      //     client.emit('READ', updated);
      //   },
      // );
    } catch (err) {
      client.disconnect();
      console.log('Invalid token, client disconnected');
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendToUser(userId: string, event: NotificationEvent, payload: any) {
    this.server.to(userId).emit(event, payload);
  }

  sendUnRead(userId: string, payload: any) {
    this.server.to(userId).emit(NotificationStatus.UN_READ, payload);
  }
}
