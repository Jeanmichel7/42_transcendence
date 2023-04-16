import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { Request } from 'express';
import { ChatRoomEntity, UserEntity } from 'src/config';
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator';
import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { Repository } from 'typeorm';
import { ChatRoomInterface } from '../interfaces/chat.room.interface';

@Injectable()
export class UserNotMutedGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChatRoomEntity) private readonly roomRepository: Repository<ChatRoomEntity>,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
		// 	context.getHandler(),
		// 	context.getClass(),
		// ]);
		// if (isPublic)
		// 	return true;

		const request = context.switchToHttp().getRequest();
    // console.log("request admin guard: ", request.user)
    // console.log("request params: ", request.params)
    // request params:  { roomId: '1', userIdToBeAdmin: '2' }
    if (!request.user)
      throw new UnauthorizedException("Authorization error", "User not found");

    const user: UserInterface = await this.userRepository.findOne({
      where: { id: request.user.id },
      select: ["id", "login"],
      relations: ["roomMutedUsers"]
    });
    if( user.roomMutedUsers.length === 0 )
      return true;

    const roomId: bigint = request.params?.roomId;
    if (!roomId)
      throw new NotFoundException("Authorization error", "Room id not found");

    const room: ChatRoomInterface = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id"],
      relations: ["mutedUsers"]
    });
    if (!room)
      throw new ForbiddenException("Authorization error", "Room not found");

    if (room.mutedUsers.find(admin => admin.id === request.user.id))
      throw new ForbiddenException("Authorization error", "User is muted in this room");

    return true;
	}

}