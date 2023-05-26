import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ChatCreateMsgDTO } from './dto/chat.message.create.dto';
import { ChatCreateRoomDTO } from './dto/chat.room.create.dto';
import { ChatUpdateRoomDTO } from './dto/chat.room.update.dto';
import { ChatJoinRoomDTO } from './dto/chat.room.join.dto';
import { ChatEditMsgDTO } from './dto/chat.message.edit.dto';

import { ChatRoomEntity, UserEntity, ChatMessageEntity } from 'config';
import { ChatMsgInterface } from './interfaces/chat.message.interface';
import { ChatRoomInterface } from './interfaces/chat.room.interface';

import { ChatJoinRoomEvent, ChatMessageCreatedEvent } from './event/chat.event';

@Injectable()
export class ChatService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly roomRepository: Repository<ChatRoomEntity>,
  ) {}

  /* ************************************************ */
  /*                       ROOM                       */
  /* ************************************************ */

  async createRoom(
    userId: bigint,
    roomToCreate: ChatCreateRoomDTO,
  ): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
      relations: ['roomUsers'],
    });

    let roomStatus: 'protected' | 'public' = roomToCreate.type;
    let hashPassword: string = null;
    if (roomToCreate.password) {
      const salt: string = await bcrypt.genSalt();
      hashPassword = await bcrypt.hash(roomToCreate.password, salt);
      roomStatus = 'protected';
    }
    const room: ChatRoomEntity = await ChatRoomEntity.save({
      ownerUser: user,
      users: [user],
      admins: [user],
      bannedUsers: [],
      mutedUsers: [],
      ...roomToCreate,
      type: roomStatus,
      password: hashPassword,
    });
    if (!room) throw new Error('Room not created');

    user.roomUsers = [...user.roomUsers, room];
    await user.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms.id',
        'chat_rooms.name',
        'chat_rooms.type',
        'chat_rooms.createdAt',
        'chat_rooms.updatedAt',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }

  async updateRoom(
    userId: bigint,
    roomId: bigint,
    roomToUpdate: ChatUpdateRoomDTO,
  ): Promise<ChatRoomInterface> {
    // const user: UserEntity = await this.userRepository.findOne({
    //   where: { id: userId },
    //   select: ['id'],
    //   relations: ['roomUsers'],
    // });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'ownerUser', 'admins', 'bannedUsers', 'mutedUsers'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    if (room.ownerUser.id !== userId)
      throw new Error('User is not owner of room');

    // const updateData: Partial<ChatRoomEntity> = {};
    if (roomToUpdate.password) {
      const hashPassword: string = await bcrypt.hash(roomToUpdate.password, 10);
      room.password = hashPassword;
    }
    if (roomToUpdate.type) {
      if (roomToUpdate.password === null && roomToUpdate.type !== 'public')
        throw new Error('Room is protected but no password');
      if (roomToUpdate.type === 'public') room.password = null;
      room.type = roomToUpdate.type;
    }
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }

  // del room
  //retour room delete or all rooms ?
  // cascade ?
  async deleteRoom(roomId: bigint): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'ownerUser', 'admins', 'bannedUsers', 'mutedUsers'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    const result: ChatRoomEntity = await room.remove();

    //retour room delete or all rooms ?
    return result;
  }

  async joinRoom(
    userId: bigint,
    roomId: bigint,
    data: ChatJoinRoomDTO,
  ): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
      relations: ['roomUsers'],
    });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type', 'password'],
      relations: ['users', 'ownerUser', 'admins', 'bannedUsers', 'mutedUsers'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    // check si user est deja dans la room
    if (room.users.some((u) => u.id === user.id))
      throw new ConflictException(
        `User ${userId} is already in room ${roomId}`,
      );

    // compare les hashs des passwords
    if (room.type === 'protected') {
      if (!data.password)
        throw new ForbiddenException(`Room ${roomId} is private`);

      const isMatch = await bcrypt.compare(data.password, room.password);
      if (!isMatch)
        throw new ForbiddenException(`Room ${roomId} password is invalid`);
    }

    room.users = [...room.users, user];
    await room.save();

    user.roomUsers = [...user.roomUsers, room];
    await user.save();

    // const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat_rooms')
    //   .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
    //   .select(['chat_rooms', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
    //   .where('chat_rooms.id = :roomId', { roomId: room.id })
    //   .getOne();

    const resultRoom: ChatRoomInterface = await this.getRoomAllMessages(
      room.id,
    );

    this.eventEmitter.emit(
      'chat_room.join',
      new ChatJoinRoomEvent(resultRoom, user.id.toString()),
    );
    return resultRoom;
  }

  async leaveRoom(userId: bigint, roomId: bigint): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
      relations: ['roomUsers'],
    });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'ownerUser', 'admins'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    // check si user est dans la room
    if (!room.users.some((u) => u.id === user.id))
      throw new ConflictException(`User ${userId} is not in room ${roomId}`);

    room.users = room.users.filter((u) => u.id !== user.id);
    room.admins = room.admins.filter((u) => u.id !== user.id);
    await room.save();
    user.roomUsers = user.roomUsers.filter((r) => r.id !== room.id);
    await user.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();

    // this.eventEmitter.emit('chat_rooms.leave', new ChatLeaveRoomEvent(resultRoom, user.id.toString()));
    return resultRoom;
  }

  async addAdminToRoom(
    userId: bigint,
    roomId: bigint,
    userIdToBeAdmin: bigint,
  ): Promise<ChatRoomInterface> {
    // const user: UserEntity = await this.userRepository.findOne({
    //   where: { id: userId },
    //   select: ["id"],
    //   relations: ["roomUsers"]
    // });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'admins'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    if (room.admins.find((admin) => admin.id === userIdToBeAdmin))
      throw new ConflictException(
        `User ${userIdToBeAdmin} is already admin of room`,
      );

    const newAdmin: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeAdmin },
      select: ['id'],
      relations: ['roomUsers', 'roomAdmins'],
    });
    if (!newAdmin)
      throw new NotFoundException(`User ${userIdToBeAdmin} not found`);

    newAdmin.roomAdmins = [...newAdmin.roomAdmins, room];
    await newAdmin.save();

    room.admins = [...room.admins, newAdmin];
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }

  async removeAdminToRoom(
    userId: bigint,
    roomId: bigint,
    userIdAdmin: bigint,
  ): Promise<ChatRoomInterface> {
    // const user: UserEntity = await this.userRepository.findOne({
    //   where: { id: userId },
    //   select: ["id"],
    //   relations: ["roomUsers"]
    // });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'admins'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    if (!room.admins.find((admin) => admin.id === userIdAdmin))
      throw new ConflictException(
        `User ${userIdAdmin} is not admin of room ${roomId}`,
      );

    const adminToDel: UserEntity = await this.userRepository.findOne({
      where: { id: userIdAdmin },
      select: ['id'],
      relations: ['roomUsers', 'roomAdmins'],
    });
    if (!adminToDel)
      throw new NotFoundException(`User ${userIdAdmin} not found`);

    adminToDel.roomAdmins = adminToDel.roomAdmins.filter(
      (r) => r.id !== room.id,
    );
    await adminToDel.save();
    room.admins = room.admins.filter((u) => u.id !== adminToDel.id);
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms.id',
        'chat_rooms.type',
        'chat_rooms.name',
        'chat_rooms.createdAt',
        'chat_rooms.updatedAt',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }

  async muteUser(
    roomId: bigint,
    userIdToBeMuted: bigint,
  ): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'mutedUsers'],
    });

    if (room.mutedUsers.find((muted) => muted.id === userIdToBeMuted))
      throw new ConflictException(
        `User ${userIdToBeMuted} is already muted in room ${roomId}`,
      );

    const userToBeMuted: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeMuted },
      select: ['id'],
      relations: ['roomUsers', 'roomMutedUsers'],
    });

    if (!userToBeMuted)
      throw new NotFoundException(`User ${userIdToBeMuted} not found`);

    userToBeMuted.roomMutedUsers = [...userToBeMuted.roomMutedUsers, room];
    await userToBeMuted.save();

    room.mutedUsers = [...room.mutedUsers, userToBeMuted];
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms.id',
        'chat_rooms.type',
        'chat_rooms.name',
        'chat_rooms.createdAt',
        'chat_rooms.updatedAt',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }

  async demuteUser(
    roomId: bigint,
    userIdToBeDemuted: bigint,
  ): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'mutedUsers'],
    });

    if (!room.mutedUsers.find((muted) => muted.id === userIdToBeDemuted))
      throw new ConflictException(
        `User ${userIdToBeDemuted} is not muted in room ${roomId}`,
      );

    const userToBeDemuted: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeDemuted },
      select: ['id'],
      relations: ['roomUsers', 'roomMutedUsers'],
    });

    if (!userToBeDemuted)
      throw new NotFoundException(`User ${userIdToBeDemuted} not found`);

    userToBeDemuted.roomMutedUsers = userToBeDemuted.roomMutedUsers.filter(
      (r) => r.id !== room.id,
    );
    await userToBeDemuted.save();

    room.mutedUsers = room.mutedUsers.filter(
      (u) => u.id !== userToBeDemuted.id,
    );
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms.id',
        'chat_rooms.type',
        'chat_rooms.name',
        'chat_rooms.createdAt',
        'chat_rooms.updatedAt',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    console.log('user demuted');
    return resultRoom;
  }

  async kickUser(
    roomId: bigint,
    userIdToBeKicked: bigint,
  ): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'mutedUsers'],
    });

    if (!room.users.find((user) => user.id === userIdToBeKicked))
      throw new ConflictException(
        `User ${userIdToBeKicked} is not in room ${roomId}`,
      );

    const userToBeKicked: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeKicked },
      select: ['id'],
      relations: ['roomUsers', 'roomMutedUsers'],
    });

    if (!userToBeKicked)
      throw new NotFoundException(`User ${userIdToBeKicked} not found`);

    userToBeKicked.roomUsers = userToBeKicked.roomUsers.filter(
      (r) => r.id !== room.id,
    );
    await userToBeKicked.save();

    room.users = room.users.filter((u) => u.id !== userToBeKicked.id);
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms.id',
        'chat_rooms.type',
        'chat_rooms.name',
        'chat_rooms.createdAt',
        'chat_rooms.updatedAt',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }

  async banUser(
    roomId: bigint,
    userIdToBeBanned: bigint,
  ): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'bannedUsers'],
    });

    if (room.bannedUsers.find((banned) => banned.id === userIdToBeBanned))
      throw new ConflictException(
        `User ${userIdToBeBanned} is already banned in room ${roomId}`,
      );

    const userToBeBanned: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeBanned },
      select: ['id'],
      relations: ['roomUsers', 'roomBannedUsers'],
    });

    if (!userToBeBanned)
      throw new NotFoundException(`User ${userIdToBeBanned} not found`);

    userToBeBanned.roomBannedUsers = [...userToBeBanned.roomBannedUsers, room];
    await userToBeBanned.save();

    room.bannedUsers = [...room.bannedUsers, userToBeBanned];
    room.users = room.users.filter((u) => u.id !== userToBeBanned.id);
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms.id',
        'chat_rooms.type',
        'chat_rooms.name',
        'chat_rooms.createdAt',
        'chat_rooms.updatedAt',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }

  async unbanUser(
    roomId: bigint,
    userIdToBeUnbanned: bigint,
  ): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'bannedUsers'],
    });

    if (!room.bannedUsers.find((banned) => banned.id === userIdToBeUnbanned))
      throw new ConflictException(
        `User ${userIdToBeUnbanned} is not banned in room ${roomId}`,
      );

    const userToBeUnbanned: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeUnbanned },
      select: ['id'],
      relations: ['roomUsers', 'roomBannedUsers'],
    });

    if (!userToBeUnbanned)
      throw new NotFoundException(`User ${userIdToBeUnbanned} not found`);

    userToBeUnbanned.roomBannedUsers = userToBeUnbanned.roomBannedUsers.filter(
      (r) => r.id !== room.id,
    );
    await userToBeUnbanned.save();

    room.bannedUsers = room.bannedUsers.filter(
      (u) => u.id !== userToBeUnbanned.id,
    );
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms.id',
        'chat_rooms.type',
        'chat_rooms.name',
        'chat_rooms.createdAt',
        'chat_rooms.updatedAt',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }

  /* ************************************************ */
  /*                      MESSAGE                     */
  /* ************************************************ */

  async createMessage(
    newMessage: ChatCreateMsgDTO,
    userId: bigint,
    roomId: bigint,
  ): Promise<ChatMsgInterface> {
    const userSend: UserEntity = await UserEntity.findOne({
      where: { id: userId },
      select: ['id', 'firstName', 'lastName', 'login'],
      relations: ['chatMessages'],
    });
    console.error('userSend', userSend);

    const room: ChatRoomEntity = await ChatRoomEntity.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['messages'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    // const chatMessageEntity: ChatMessageEntity = new ChatMessageEntity();
    // chatMessageEntity.text = newMessage.text;
    // chatMessageEntity.ownerUser = userSend;

    const message: ChatMessageEntity = await ChatMessageEntity.save({
      text: newMessage.text,
    });
    if (!message) throw new Error('Message not created');

    userSend.chatMessages = [...userSend.chatMessages, message];
    await userSend.save();
    room.messages = [...room.messages, message];
    await room.save();

    const messageToSave: ChatMsgInterface = {
      id: message.id,
      text: message.text,
      room: {
        id: room.id,
        type: room.type,
        name: room.name,
      },
      user: {
        id: userSend.id,
        firstName: userSend.firstName,
        lastName: userSend.lastName,
        login: userSend.login,
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };

    this.eventEmitter.emit(
      'chat_message.created',
      new ChatMessageCreatedEvent(messageToSave),
    );

    return messageToSave;
  }

  async editMessage(
    userId: bigint,
    messageId: bigint,
    editMessage: ChatEditMsgDTO,
  ): Promise<ChatMsgInterface> {
    const message: ChatMessageEntity = await ChatMessageEntity.findOne({
      where: { id: messageId },
      select: ['id', 'text', 'createdAt', 'updatedAt'],
      relations: ['user', 'room'],
    });

    if (!message) throw new NotFoundException(`Message ${messageId} not found`);

    if (message.user.id !== userId)
      throw new ForbiddenException(
        `User ${userId} is not owner of message ${messageId}`,
      );

    message.text = editMessage.text;
    message.updatedAt = new Date();
    await message.save();

    const resultMessage: ChatMsgInterface = {
      id: message.id,
      text: message.text,
      room: {
        id: message.room.id,
        type: message.room.type,
        name: message.room.name,
      },
      user: {
        id: message.user.id,
        firstName: message.user.firstName,
        lastName: message.user.lastName,
        login: message.user.login,
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };

    // this.eventEmitter.emit('chat_message.edited', new ChatMessageEditedEvent(resultMessage));

    return resultMessage;
  }

  async deleteMessage(userId: bigint, messageId: bigint): Promise<any> {
    const message: ChatMessageEntity = await ChatMessageEntity.findOne({
      where: { id: messageId },
      select: ['id', 'text', 'createdAt', 'updatedAt'],
      relations: ['user', 'room'],
    });

    if (!message) throw new NotFoundException(`Message ${messageId} not found`);

    if (message.user.id !== userId)
      throw new ForbiddenException(
        `User ${userId} is not owner of message ${messageId}`,
      );

    const result = await message.remove();
    if (!result) return 0;

    // this.eventEmitter.emit('chat_message.deleted', new ChatMessageDeletedEvent(messageId));
    return 1;
  }

  async getAllRoomsToDisplay(): Promise<ChatRoomInterface[]> {
    const rooms: ChatRoomEntity[] = await ChatRoomEntity.createQueryBuilder(
      'chat_rooms',
    )
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .leftJoinAndSelect('chat_rooms.users', 'users')
      .leftJoinAndSelect('chat_rooms.admins', 'admins')
      .leftJoinAndSelect('chat_rooms.bannedUsers', 'bannedUsers')
      .leftJoinAndSelect('chat_rooms.mutedUsers', 'mutedUsers')
      .select([
        'chat_rooms.id',
        'chat_rooms.type',
        'chat_rooms.name',
        'chat_rooms.createdAt',
        'chat_rooms.updatedAt',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
        'ownerUser.avatar',
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.login',
        'users.avatar',
        'admins.id',
        'admins.firstName',
        'admins.lastName',
        'admins.login',
        'admins.avatar',
        'bannedUsers.id',
        'bannedUsers.firstName',
        'bannedUsers.lastName',
        'bannedUsers.login',
        'bannedUsers.avatar',
        'mutedUsers.id',
        'mutedUsers.firstName',
        'mutedUsers.lastName',
        'mutedUsers.login',
        'mutedUsers.avatar',
      ])
      .getMany();

    const result: ChatRoomInterface[] = rooms.map((room: ChatRoomEntity) => {
      return { ...room };
    });
    return result;
  }

  /* ************************************************ */
  /*                      ADMIN                       */
  /* ************************************************ */

  async getAllRooms(): Promise<ChatRoomInterface[]> {
    const rooms: ChatRoomEntity[] = await ChatRoomEntity.find({
      select: ['id', 'type'],
      relations: [
        'messages',
        'ownerUser',
        'users',
        'admins',
        'bannedUsers',
        'mutedUsers',
      ],
    });
    const result: ChatRoomInterface[] = rooms.map((room: ChatRoomEntity) => {
      return { ...room };
    });
    return result;
  }

  async getRoom(roomId: bigint): Promise<ChatRoomInterface> {
    const room: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .leftJoinAndSelect('chat_rooms.users', 'users')
      .leftJoinAndSelect('chat_rooms.admins', 'admins')
      .leftJoinAndSelect('chat_rooms.bannedUsers', 'bannedUsers')
      .leftJoinAndSelect('chat_rooms.mutedUsers', 'mutedUsers')
      .leftJoinAndSelect('chat_rooms.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'ownerMessage')
      .select([
        'chat_rooms',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.login',
        'admins.id',
        'admins.firstName',
        'admins.lastName',
        'admins.login',
        'bannedUsers.id',
        'bannedUsers.firstName',
        'bannedUsers.lastName',
        'bannedUsers.login',
        'mutedUsers.id',
        'mutedUsers.firstName',
        'mutedUsers.lastName',
        'mutedUsers.login',
        'messages.id',
        'messages.text',
        'messages.createdAt',
        'ownerMessage.id',
        'ownerMessage.firstName',
        'ownerMessage.lastName',
        'ownerMessage.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId })
      .getOne();
    return room;
  }

  async getRoomAllMessages(roomId: bigint): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'ownerMessage')
      .select([
        'chat_rooms.id',
        'chat_rooms.type',
        'chat_rooms.name',
        'messages.id',
        'messages.text',
        'messages.createdAt',
        'ownerMessage.id',
        'ownerMessage.firstName',
        'ownerMessage.lastName',
        'ownerMessage.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId })
      .orderBy('messages.createdAt', 'DESC')
      .getOne();
    console.log(room);
    if (!room) throw new NotFoundException(`Room ${roomId} does not exist`);
    const result: ChatRoomInterface = { ...room };
    return result;
  }
}
