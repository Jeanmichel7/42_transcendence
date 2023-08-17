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
export class AdminRoomGuard implements CanActivate {
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
      relations: ['roomAdmins'],
    });
    if (user.roomAdmins.length === 0)
      throw new ForbiddenException(
        'Authorization error',
        'User is not admin of any room',
      );

    const roomId: bigint = request.params?.roomId;
    if (!roomId)
      throw new UnauthorizedException(
        'Authorization error',
        'Room id not found',
      );

    const room: ChatRoomInterface = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id'],
      relations: ['admins'],
    });
    if (!room)
      throw new ForbiddenException('Authorization error', 'Room not found');

    if (room.admins.find(admin => admin.id === request.user.id)) return true;

    throw new ForbiddenException(
      'Authorization error',
      `User ${request.user.login} is not admin of this room`,
    );
  }
}
