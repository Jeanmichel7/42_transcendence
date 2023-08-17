import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatRoomEntity, UserEntity } from 'config';
import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { Repository } from 'typeorm';
import { ChatRoomInterface } from '../interfaces/chat.room.interface';

@Injectable()
export class UserNotMutedGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly roomRepository: Repository<ChatRoomEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user)
      throw new UnauthorizedException('Authorization error', 'User not found');

    const user: UserInterface = await this.userRepository.findOne({
      where: { id: request.user.id },
      select: ['id', 'login'],
      relations: ['roomMutedUsers'],
    });
    if (user.roomMutedUsers.length === 0) return true;

    const roomId: bigint = request.params?.roomId;
    if (!roomId)
      throw new NotFoundException('Authorization error', 'Room id not found');

    const room: ChatRoomInterface = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id'],
      relations: ['mutedUsers'],
    });
    if (!room)
      throw new ForbiddenException('Authorization error', 'Room not found');

    if (room.mutedUsers.find(admin => admin.id === request.user.id))
      throw new ForbiddenException(
        'Authorization error',
        'User is muted in this room',
      );

    return true;
  }
}
