// // import { Param, Query } from '@nestjs/common';
// import {
//   ConnectedSocket,
//   MessageBody,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { UserInterface } from 'src/modules/users/interfaces/users.interface';
// import { UserStatusInterface } from '../interfaces/status.interface';

// @WebSocketGateway({
//   namespace: 'user',
//   cors: {
//     origin: 'http://localhost:3006',
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     credentials: true,
//   },
// })
// export class UserGateway {
//   @WebSocketServer() server: Server;

//   async handleConnection(@ConnectedSocket() client: Socket) {
//     console.log('user is connected to user gateway', client.id);
//   }
//   async handleDisconnect(@ConnectedSocket() client: Socket) {
//     console.log('user is disconnected to user gateway', client.id);
//   }

//   emitUpdateUserStatus(updateStatusUser: UserStatusInterface) {
//     console.log('updateStatusUser : ', updateStatusUser);
//     this.server.emit('update_user_status', updateStatusUser, (ack) => {
//       if (ack) {
//         console.log('update status sent to room' + updateStatusUser);
//       } else {
//         console.log('update status not sent to room' + updateStatusUser);
//       }
//     });
//   }
// }
