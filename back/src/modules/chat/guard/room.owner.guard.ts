import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatRoomEntity, UserEntity } from 'config';
import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { Repository } from 'typeorm';
import { ChatRoomInterface } from '../interfaces/chat.room.interface';

@Injectable()
export class OwnerRoomGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly roomRepository: Repository<ChatRoomEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user)
      throw new UnauthorizedException(
        'Authorization error',
        'User not accurate',
      );

    const user: UserInterface = await this.userRepository.findOne({
      where: { id: request.user.id },
      select: ['id', 'login'],
      relations: ['roomOwner'],
    });
    if (user.roomOwner.length === 0)
      throw new ForbiddenException(
        'Authorization error',
        'User is not the owner of any room',
      );

    const roomId: bigint = request.params?.roomId;
    if (!roomId)
      throw new UnauthorizedException(
        'Authorization error',
        `Room not accurate`,
      );

    const room: ChatRoomInterface = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id'],
      relations: ['ownerUser'],
    });
    if (!room)
      throw new ForbiddenException('Authorization error', 'Room not found');

    if (room.ownerUser.id === user.id) return true;

    throw new ForbiddenException(
      'Authorization error',
      `User ${request.user.login} is not the owner of this room`,
    );
  }
}
