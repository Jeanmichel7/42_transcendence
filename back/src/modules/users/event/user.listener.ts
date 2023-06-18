// import { OnEvent } from '@nestjs/event-emitter';
// import { Injectable } from '@nestjs/common';
// import { UserGateway } from '../gateway/users.gateway';
// import { UserUpdateEvent } from './user.event';

// @Injectable()
// export class UserUpdateListener {
//   constructor(private readonly socketEvents: UserGateway) {}

//   /* USER */
//   @OnEvent('user_status.updated')
//   handleUserStatusUpdated(event: UserUpdateEvent) {
//     console.log('event user_status.updated recu', event.userStatus);
//     this.socketEvents.emitUpdateUserStatus(event.userStatus);
//   }
// }
