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

import {
  BotChatMessageEvent,
  ChatMessageEvent,
  ChatUserRoomEvent,
} from './event/chat.event';

const limit = 20;

@Injectable()
export class ChatService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly roomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(ChatMessageEntity)
    private readonly messageRepository: Repository<ChatMessageEntity>,
  ) {}

  /* ************************************************ */
  /*                       ROOM                       */
  /* ************************************************ */

  async createRoom(
    userId: bigint,
    roomToCreate: ChatCreateRoomDTO,
  ): Promise<ChatRoomInterface> {
    // console.log('data room creation : ', roomToCreate);

    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
      relations: ['roomUsers'],
    });

    let hashPassword: string = null;
    if (roomToCreate.password) {
      const salt: string = await bcrypt.genSalt();
      hashPassword = await bcrypt.hash(roomToCreate.password, salt);
    }

    // si private et accepted users[] => checher chaque user dans la bdd et ajouter dans la room
    let allUsersAccepted: UserEntity[] = [];
    if (roomToCreate.type === 'private' && roomToCreate.acceptedUsers) {
      allUsersAccepted = await Promise.all(
        roomToCreate.acceptedUsers.map(async (userId) => {
          const userAccepted: UserEntity = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id'],
            relations: ['roomUsers'],
          });
          if (!userAccepted)
            throw new NotFoundException(`User ${user.login} not found`);
          return userAccepted;
        }),
      );
      // console.log('allUsersAccepted', allUsersAccepted);
    }
    let usersInRoom: UserEntity[] = [user];
    if (roomToCreate.acceptedUsers) {
      usersInRoom = [user, ...allUsersAccepted];
    }

    const room: ChatRoomEntity = await ChatRoomEntity.save({
      ownerUser: user,
      users: usersInRoom,
      admins: [user],
      bannedUsers: [],
      mutedUsers: [],
      ...roomToCreate,
      type: roomToCreate.type,
      isProtected: roomToCreate.password ? true : false,
      password: hashPassword,
      acceptedUsers: allUsersAccepted,
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
      relations: [
        'users',
        'ownerUser',
        'admins',
        'bannedUsers',
        'mutedUsers',
        'acceptedUsers',
      ],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    if (room.ownerUser.id !== userId)
      throw new Error('User is not owner of room');

    if (roomToUpdate.isProtected != null) {
      if (roomToUpdate.isProtected === true) {
        if (roomToUpdate.password === null)
          throw new Error('Room is protected but no password');
        room.isProtected = true;
      }
      if (roomToUpdate.isProtected === false) {
        room.password = null;
        room.isProtected = false;
      }
    }

    if (roomToUpdate.password) {
      const hashPassword: string = await bcrypt.hash(roomToUpdate.password, 10);
      room.password = hashPassword;
      room.isProtected = true;
    }
    if (roomToUpdate.type) room.type = roomToUpdate.type;
    if (roomToUpdate.name) room.name = roomToUpdate.name;
    if (roomToUpdate.acceptedUsers) {
      const allUsersAccepted: UserEntity[] = await Promise.all(
        roomToUpdate.acceptedUsers.map(async (userLogin) => {
          const userAccepted: UserEntity = await this.userRepository.findOne({
            where: { login: userLogin },
            select: ['id'],
            relations: ['roomUsers'],
          });
          if (!userAccepted)
            throw new NotFoundException(`User ${userLogin} not found`);
          return userAccepted;
        }),
      );
      room.acceptedUsers = allUsersAccepted;
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
    if (!result) throw new Error('Room not deleted');
    this.eventEmitter.emit('chat_room.deleted', roomId);
    return result;
  }

  async joinRoom(
    userId: bigint,
    roomId: bigint,
    data: ChatJoinRoomDTO,
  ): Promise<ChatRoomInterface> {
    // console.log('data join room : ', data);
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'], // a verifier
      relations: ['roomUsers'],
    });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'name', 'type', 'password', 'isProtected'],
      relations: [
        'users',
        'ownerUser',
        'admins',
        'bannedUsers',
        'acceptedUsers',
      ],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    // check si user est deja dans la room
    if (room.users.some((u) => u.id === user.id))
      throw new ConflictException(
        `User ${userId} is already in room ${roomId}`,
      );

    //verifie si user est banned
    if (room.bannedUsers.some((u) => u.id === user.id))
      throw new ForbiddenException(`User ${userId} is banned from room`);

    //verifie sur room est private et si accepte user
    if (room.type === 'private' && room.acceptedUsers.length > 0) {
      if (!room.acceptedUsers.some((u) => u.id === user.id))
        throw new ForbiddenException(`User ${userId} is not accepted in room`);
    }

    // compare les hashs des passwords
    if (room.isProtected) {
      if (data.password === null)
        throw new ForbiddenException(
          `Room ${roomId} is private and need password`,
        );
      const isMatch = await bcrypt.compare(data.password, room.password);
      if (!isMatch)
        throw new ForbiddenException(`Room ${room.name} password is invalid`);
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

    const resultRoom: ChatRoomInterface = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoinAndSelect('chat_rooms.ownerUser', 'ownerUser')
      .leftJoinAndSelect('chat_rooms.users', 'users')
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
        'ownerUser.status',
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.login',
        'users.avatar',
        'users.status',
      ])
      .leftJoin('chat_rooms.admins', 'admins')
      .addSelect([
        'admins.id',
        'admins.firstName',
        'admins.lastName',
        'admins.login',
        'admins.avatar',
        'admins.status',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();

    const newBotMessage: ChatCreateMsgDTO = {
      text: `${user.login} has join the room`,
    };

    // pour eviter de convertir un bigint en number
    const userBot: UserEntity = await this.userRepository.findOne({
      where: { login: 'Bot' },
      select: ['id', 'login'],
    });
    const res = await this.createMessage(newBotMessage, userBot.id, roomId);
    if (!res) throw new Error('Bot message not created');

    this.eventEmitter.emit(
      'chat_room.join',
      new ChatUserRoomEvent(room.id, {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        avatar: user.avatar,
        status: user.status,
      }),
    );

    return resultRoom;
  }

  async leaveRoom(userId: bigint, roomId: bigint): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login'],
      relations: ['roomUsers'],
    });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ['id', 'type'],
      relations: ['users', 'ownerUser', 'admins'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);

    //check si owner leave
    if (room.ownerUser.id === user.id)
      throw new ConflictException(`Owner ${userId} can't leave room ${roomId}`);

    // check si user est dans la room
    if (!room.users.some((u) => u.id === user.id))
      throw new ConflictException(`User ${userId} is not in room ${roomId}`);

    room.users = room.users.filter((u) => u.id !== user.id);
    room.admins = room.admins.filter((u) => u.id !== user.id);
    await room.save();
    user.roomUsers = user.roomUsers.filter((r) => r.id !== room.id);
    await user.save();

    const resultRoom: ChatRoomEntity = await this.roomRepository
      .createQueryBuilder('chat_rooms')
      .leftJoin('chat_rooms.ownerUser', 'ownerUser')
      .select([
        'chat_rooms',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('chat_rooms.id = :roomId', { roomId: room.id })
      .getOne();

    const newBotMessage: ChatCreateMsgDTO = {
      text: `${user.login} has left the room`,
    };

    const userBot: UserEntity = await this.userRepository.findOne({
      where: { login: 'Bot' },
      select: ['id', 'login'],
    });

    const res = await this.createMessage(newBotMessage, userBot.id, roomId);
    if (!res) throw new Error('Bot message not created');
    this.eventEmitter.emit(
      'chat_room.leave',
      new BotChatMessageEvent({
        roomId: room.id,
        userId: user.id as bigint,
        userLogin: user.login,
        text: `${user.login} has left the room`,
        createdAt: new Date(),
      }),
    );

    return resultRoom;
  }

  async addAdminToRoom(
    userId: bigint, //owner room guard donc pas besoin ?
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

    this.eventEmitter.emit(
      'chat_room.admin.added',
      new ChatUserRoomEvent(room.id, {
        id: newAdmin.id,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        login: newAdmin.login,
        avatar: newAdmin.avatar,
        status: newAdmin.status,
      }),
    );
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

    this.eventEmitter.emit(
      'chat_room.admin.removed',
      new BotChatMessageEvent({
        roomId: room.id,
        userId: adminToDel.id,
        userLogin: adminToDel.login,
        text: `${adminToDel.login} is no longer admin of room`,
        createdAt: new Date(),
      }),
    );

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
      select: ['id', 'login'],
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

    const newBotMessage: ChatCreateMsgDTO = {
      text: `${userToBeMuted.login} has been muted this idiot`,
    };

    // pour eviter de convertir un bigint en number
    const userBot: UserEntity = await this.userRepository.findOne({
      where: { login: 'Bot' },
      select: ['id', 'login'],
    });
    const res = await this.createMessage(newBotMessage, userBot.id, roomId);
    if (!res) throw new Error('Bot message not created');

    this.eventEmitter.emit(
      'chat_room.muted',
      new ChatUserRoomEvent(room.id, {
        id: userToBeMuted.id,
        firstName: userToBeMuted.firstName,
        lastName: userToBeMuted.lastName,
        login: userToBeMuted.login,
        avatar: userToBeMuted.avatar,
        status: userToBeMuted.status,
      }),
    );

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
      select: ['id', 'login'],
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

    const newBotMessage: ChatCreateMsgDTO = {
      text: `${userToBeDemuted.login} has been unmuted`,
    };

    // pour eviter de convertir un bigint en number
    const userBot: UserEntity = await this.userRepository.findOne({
      where: { login: 'Bot' },
      select: ['id', 'login'],
    });
    const res = await this.createMessage(newBotMessage, userBot.id, roomId);
    if (!res) throw new Error('Bot message not created');

    this.eventEmitter.emit(
      'chat_room.unmuted',
      new ChatUserRoomEvent(room.id, {
        id: userToBeDemuted.id,
        firstName: userToBeDemuted.firstName,
        lastName: userToBeDemuted.lastName,
        login: userToBeDemuted.login,
        avatar: userToBeDemuted.avatar,
        status: userToBeDemuted.status,
      }),
    );

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
      select: ['id', 'login'],
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

    const newBotMessage: ChatCreateMsgDTO = {
      text: `${userToBeKicked.login} has been kicked`,
    };

    // pour eviter de convertir un bigint en number
    const userBot: UserEntity = await this.userRepository.findOne({
      where: { login: 'Bot' },
      select: ['id', 'login'],
    });
    const res = await this.createMessage(newBotMessage, userBot.id, roomId);
    if (!res) throw new Error('Bot message not created');

    this.eventEmitter.emit(
      'chat_room.kicked',
      new BotChatMessageEvent({
        roomId: room.id,
        userId: userToBeKicked.id,
        userLogin: userToBeKicked.login,
        text: `${userToBeKicked.login} has been kicked`,
        createdAt: new Date(),
      }),
    );

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
      select: ['id', 'login'],
      relations: ['roomUsers', 'roomBannedUsers'],
    });

    if (!userToBeBanned)
      throw new NotFoundException(`User ${userIdToBeBanned} not found`);

    userToBeBanned.roomBannedUsers = [...userToBeBanned.roomBannedUsers, room];
    await userToBeBanned.save();

    room.bannedUsers = [...room.bannedUsers, userToBeBanned];
    // room.users = room.users.filter((u) => u.id !== userToBeBanned.id);
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

    const newBotMessage: ChatCreateMsgDTO = {
      text: `${userToBeBanned.login} has been banned`,
    };

    // pour eviter de convertir un bigint en number
    const userBot: UserEntity = await this.userRepository.findOne({
      where: { login: 'Bot' },
      select: ['id', 'login'],
    });
    const res = await this.createMessage(newBotMessage, userBot.id, roomId);
    if (!res) throw new Error('Bot message not created');

    this.eventEmitter.emit(
      'chat_room.banned',
      new ChatUserRoomEvent(room.id, {
        id: userToBeBanned.id,
        firstName: userToBeBanned.firstName,
        lastName: userToBeBanned.lastName,
        login: userToBeBanned.login,
        avatar: userToBeBanned.avatar,
        status: userToBeBanned.status,
      }),
    );

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
      select: ['id', 'login'],
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

    const newBotMessage: ChatCreateMsgDTO = {
      text: `${userToBeUnbanned.login} has been unbanned`,
    };

    // pour eviter de convertir un bigint en number
    const userBot: UserEntity = await this.userRepository.findOne({
      where: { login: 'Bot' },
      select: ['id', 'login'],
    });
    const res = await this.createMessage(newBotMessage, userBot.id, roomId);
    if (!res) throw new Error('Bot message not created');

    this.eventEmitter.emit(
      'chat_room.unbanned',
      new BotChatMessageEvent({
        roomId: room.id,
        userId: userToBeUnbanned.id,
        userLogin: userToBeUnbanned.login,
        text: `${userToBeUnbanned.login} has been unbanned`,
        createdAt: new Date(),
      }),
    );

    return resultRoom;
  }

  /* ************************************************ */
  /*                      MESSAGE                     */
  /* ************************************************ */

  async getRoomAllMessages(
    userId: bigint,
    roomId: bigint,
  ): Promise<ChatMsgInterface[]> {
    const messages: ChatMessageEntity[] = await this.messageRepository
      .createQueryBuilder('chat_messages')
      .select([
        'chat_messages.id',
        'chat_messages.text',
        'chat_messages.createdAt',
        'chat_messages.updatedAt',
      ])
      .leftJoin('chat_messages.ownerUser', 'ownerUser')
      .addSelect([
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
        'ownerUser.avatar',
        'ownerUser.status',
      ])
      .leftJoin('chat_messages.room', 'room')
      .addSelect(['room.id', 'room.type', 'room.name', 'room.isProtected'])
      .leftJoin('room.users', 'users')
      .addSelect([
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.login',
        'users.avatar',
        'users.status',
      ])
      .where('room.id = :roomId', { roomId })
      .orderBy('chat_messages.createdAt', 'DESC')
      .getMany();

    //check user is in room
    if (messages[0] && !messages[0].room.users.some((u) => u.id === userId))
      throw new ForbiddenException(
        `User ${userId} is not in room ${roomId} and can't see messages`,
      );

    return messages;
  }

  async getRoomMessagesPaginate(
    userId: bigint,
    roomId: bigint,
    page: number,
    offset: number,
  ): Promise<ChatMsgInterface[]> {
    if (page < 1) page = 1;
    if (offset < 0) offset = 0;
    if (offset > limit) {
      page = page + Math.floor(offset / limit);
      offset = offset % limit;
    }
    const skip = (page - 1) * limit - offset;

    const messages: ChatMessageEntity[] = await this.messageRepository
      .createQueryBuilder('chat_messages')
      .select([
        'chat_messages.id',
        'chat_messages.text',
        'chat_messages.createdAt',
        'chat_messages.updatedAt',
      ])
      .leftJoin('chat_messages.ownerUser', 'ownerUser')
      .addSelect([
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
        'ownerUser.avatar',
        'ownerUser.status',
      ])
      .leftJoin('chat_messages.room', 'room')
      .addSelect(['room.id', 'room.type', 'room.name', 'room.isProtected'])
      .leftJoin('room.users', 'users')
      .addSelect([
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.login',
        'users.avatar',
        'users.status',
      ])
      .where('room.id = :roomId', { roomId })
      .orderBy('chat_messages.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    //check user is in room
    if (messages[0] && !messages[0].room.users.some((u) => u.id === userId))
      throw new ForbiddenException(
        `User ${userId} is not in room ${roomId} and can't see messages`,
      );

    return messages;
  }

  async createMessage(
    newMessage: ChatCreateMsgDTO,
    userId: bigint,
    roomId: bigint,
  ): Promise<ChatMsgInterface> {
    const userSend: UserEntity = await UserEntity.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['chatMessages'],
    });
    console.log('userSend', userSend);

    const room: ChatRoomEntity = await ChatRoomEntity.findOne({
      where: { id: roomId },
      select: ['id', 'type', 'name', 'isProtected'],
      relations: ['messages', 'users', 'acceptedUsers'],
    });
    if (!room) throw new NotFoundException(`Room ${roomId} not found`);
    console.log('room', room);
    //check if userSend is in room or in acceptedUser
    if (
      room.users.some((u) => u.id === userSend.id) ||
      room.acceptedUsers.some((u) => u.id === userSend.id)
    ) {
      console.log('userSend is in room');
    } else {
      throw new ForbiddenException(
        `User ${userId} is not in room ${roomId} and can't send message`,
      );
    }

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
        isProtected: room.isProtected,
      },
      ownerUser: {
        id: userSend.id,
        firstName: userSend.firstName,
        lastName: userSend.lastName,
        login: userSend.login,
        status: userSend.status,
        avatar: userSend.avatar,
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
    this.eventEmitter.emit(
      'chat_message.created',
      new ChatMessageEvent(messageToSave),
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
      relations: ['ownerUser', 'room'],
    });

    if (!message) throw new NotFoundException(`Message ${messageId} not found`);

    if (message.ownerUser.id !== userId)
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
        isProtected: message.room.isProtected,
      },
      ownerUser: {
        id: message.ownerUser.id,
        firstName: message.ownerUser.firstName,
        lastName: message.ownerUser.lastName,
        login: message.ownerUser.login,
        status: message.ownerUser.status,
        avatar: message.ownerUser.avatar,
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
    this.eventEmitter.emit(
      'chat_message.edited',
      new ChatMessageEvent(resultMessage),
    );
    return resultMessage;
  }

  async deleteMessage(userId: bigint, messageId: bigint): Promise<boolean> {
    const message: ChatMessageEntity = await ChatMessageEntity.findOne({
      where: { id: messageId },
      relations: ['ownerUser', 'room'],
    });

    if (!message) throw new NotFoundException(`Message ${messageId} not found`);

    if (message.ownerUser.id !== userId)
      throw new ForbiddenException(
        `User ${userId} is not owner of message ${messageId}`,
      );
    const result = await ChatMessageEntity.delete({ id: messageId });
    if (!result) return false;

    this.eventEmitter.emit(
      'chat_message.deleted',
      new ChatMessageEvent(message),
    );
    return true;
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
        'chat_rooms.isProtected',
        'chat_rooms.password',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
        'ownerUser.avatar',
        'ownerUser.status',
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.login',
        'users.avatar',
        'users.status',
        'admins.id',
        'admins.firstName',
        'admins.lastName',
        'admins.login',
        'admins.avatar',
        'admins.status',
        'bannedUsers.id',
        'bannedUsers.firstName',
        'bannedUsers.lastName',
        'bannedUsers.login',
        'bannedUsers.avatar',
        'bannedUsers.status',
        'mutedUsers.id',
        'mutedUsers.firstName',
        'mutedUsers.lastName',
        'mutedUsers.login',
        'mutedUsers.avatar',
        'mutedUsers.status',
      ])
      .getMany();

    const result: ChatRoomInterface[] = rooms.filter(
      (room) => room.type === 'public',
    );
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
      .leftJoinAndSelect('chat_rooms.acceptedUsers', 'acceptedUsers')
      .leftJoinAndSelect('messages.ownerUser', 'ownerMessage')
      .select([
        'chat_rooms',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
        'ownerUser.avatar',
        'ownerUser.status',
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.login',
        'users.avatar',
        'users.status',
        'admins.id',
        'admins.firstName',
        'admins.lastName',
        'admins.login',
        'admins.avatar',
        'admins.status',
        'bannedUsers.id',
        'bannedUsers.firstName',
        'bannedUsers.lastName',
        'bannedUsers.login',
        'bannedUsers.avatar',
        'bannedUsers.status',
        'mutedUsers.id',
        'mutedUsers.firstName',
        'mutedUsers.lastName',
        'mutedUsers.login',
        'mutedUsers.avatar',
        'mutedUsers.status',
        'messages.id',
        'messages.text',
        'messages.createdAt',
        'messages.updatedAt',
        'ownerMessage.id',
        'ownerMessage.firstName',
        'ownerMessage.lastName',
        'ownerMessage.login',
        'ownerMessage.avatar',
        'ownerMessage.status',
        'acceptedUsers', //// a verfier ///
        'acceptedUsers.id',
        'acceptedUsers.firstName',
        'acceptedUsers.lastName',
        'acceptedUsers.login',
        'acceptedUsers.avatar',
        'acceptedUsers.status',
      ])
      .where('chat_rooms.id = :roomId', { roomId })
      .getOne();
    return room;
  }
}
