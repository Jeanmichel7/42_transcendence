import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessageEntity } from './entity/chat.message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatCreateMsgDTO } from './dto/chat.createMessage.dto';
import { ChatCreateRoomDTO } from './dto/chat.createRoom.dto';
import { ChatUpdateRoomDTO } from './dto/chat.updateRoom.dto';

import { ChatMsgInterface } from './interfaces/chat.message.interface';
import { Repository } from 'typeorm';
import { ChatRoomEntity, UserEntity } from 'src/config';
import { ChatRoomInterface } from './interfaces/chat.room.interface';
import { ChatJoinRoomEvent, ChatMessageCreatedEvent } from './event/chat.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RouterModule } from '@nestjs/core';
import { ChatJoinRoomDTO } from './dto/chat.room.join.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    // @InjectRepository(ChatMessageEntity) private readonly messageService: Repository<ChatMessageEntity>,
    @InjectRepository(ChatRoomEntity) private readonly roomRepository: Repository<ChatRoomEntity>,
    private readonly eventEmitter: EventEmitter2
  ) { }


  /* ************************************************ */
  /*                       ROOM                       */
  /* ************************************************ */

  async createRoom(
    userId: bigint,
    roomToCreate: ChatCreateRoomDTO
  ): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id"],
      relations: ["roomUsers"]
    });

    let roomStatus = "public"
    if (roomToCreate.password) {
      // roomToCreate.password = await bcrypt.hash(roomToCreate.password, 10);
      roomStatus = "protected";
    }
    const room: ChatRoomEntity = await ChatRoomEntity.save({
      ownerUser: user,
      users: [user],
      admins: [user],
      bannedUsers: [],
      mutedUsers: [],
      ...roomToCreate,
      status: roomStatus
    });
    if (!room)
      throw new Error("Room not created");

    user.roomUsers = [...user.roomUsers, room];
    await user.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
      .where('chat-room.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }


  async updateRoom(
    userId: bigint,
    roomId: bigint,
    roomToUpdate: ChatUpdateRoomDTO
  ): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id"],
      relations: ["roomUsers"]
    });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id", "status"],
      relations: ["users", "ownerUser", "admins", "bannedUsers", "mutedUsers"]
    });
    if (!room)
      throw new NotFoundException(`Room ${roomId} not found`);

    if (room.ownerUser.id !== userId)
      throw new Error("User is not owner of room");

    // const updateData: Partial<ChatRoomEntity> = {};
    if (roomToUpdate.password) room.password = roomToUpdate.password;
    if (roomToUpdate.status) room.status = roomToUpdate.status;
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
      .where('chat-room.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }


  // del room
  //retour room delete or all rooms ?
  async deleteRoom( roomId: bigint ): Promise< ChatRoomInterface > {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id", "status"],
      relations: ["users", "ownerUser", "admins", "bannedUsers", "mutedUsers"]
    });
    if (!room)
      throw new NotFoundException(`Room ${roomId} not found`);

    const result: ChatRoomEntity = await room.remove();
    
    //retour room delete or all rooms ?
    return result;
  }








  async joinRoom(
    userId: bigint,
    roomId: bigint,
    data: ChatJoinRoomDTO
  ): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id"],
      relations: ["roomUsers"]
    });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id", "status", "password"],
      relations: ["users", "ownerUser", "admins", "bannedUsers", "mutedUsers"]
    });
    if (!room)
      throw new NotFoundException(`Room ${roomId} not found`);

    // check si user est deja dans la room
    if (room.users.some(u => u.id === user.id))
      throw new ConflictException(`User ${userId} is already in room ${roomId}`);


    // compare les hashs des passwords
    if (room.status !== 'public') {
      if (!data.password)
        throw new ForbiddenException(`Room ${roomId} is private`);
      if (room.password !== data.password)
        throw new ForbiddenException(`Room ${roomId} password is invalid`);
    }


    room.users = [...room.users, user];
    await room.save();

    user.roomUsers = [...user.roomUsers, room];
    await user.save();

    // const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
    //   .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
    //   .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
    //   .where('chat-room.id = :roomId', { roomId: room.id })
    //   .getOne();

    const resultRoom: ChatRoomInterface = await this.getRoomAllMessages(room.id);

    this.eventEmitter.emit('chat-room.join', new ChatJoinRoomEvent(resultRoom, user.id.toString()));
    return resultRoom;
  }

  async leaveRoom(
    userId: bigint,
    roomId: bigint
  ): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id"],
      relations: ["roomUsers"]
    });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id", "status"],
      relations: ["users", "ownerUser", "admins", "bannedUsers", "mutedUsers"]
    });
    if (!room)
      throw new NotFoundException(`Room ${roomId} not found`);

    // check si user est dans la room
    if (!room.users.some(u => u.id === user.id))
      throw new ConflictException(`User ${userId} is not in room ${roomId}`);

    room.users = room.users.filter(u => u.id !== user.id);
    await room.save();
    user.roomUsers = user.roomUsers.filter(r => r.id !== room.id);
    await user.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
      .where('chat-room.id = :roomId', { roomId: room.id })
      .getOne();

    // this.eventEmitter.emit('chat-room.leave', new ChatLeaveRoomEvent(resultRoom, user.id.toString()));
    return resultRoom;
  }








  async addAdminToRoom(
    userId: bigint,
    roomId: bigint,
    userIdToBeAdmin: bigint
  ): Promise<ChatRoomInterface> {
    // const user: UserEntity = await this.userRepository.findOne({
    //   where: { id: userId },
    //   select: ["id"],
    //   relations: ["roomUsers"]
    // });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id", "status"],
      relations: ["users", "admins"]
    });
    if (!room)
      throw new NotFoundException(`Room ${roomId} not found`);

    if (room.admins.find(admin => admin.id === userIdToBeAdmin))
      throw new ConflictException(`User ${userIdToBeAdmin} is already admin of room`);

    const newAdmin: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeAdmin },
      select: ["id"],
      relations: ["roomUsers", "roomAdmins"]
    });
    if (!newAdmin)
      throw new NotFoundException(`User ${userIdToBeAdmin} not found`);

    newAdmin.roomAdmins = [...newAdmin.roomAdmins, room];
    await newAdmin.save();

    room.admins = [...room.admins, newAdmin];
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
      .where('chat-room.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }




  async removeAdminToRoom(
    userId: bigint,
    roomId: bigint,
    userIdAdmin: bigint
  ): Promise<ChatRoomInterface> {
    // const user: UserEntity = await this.userRepository.findOne({
    //   where: { id: userId },
    //   select: ["id"],
    //   relations: ["roomUsers"]
    // });

    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id", "status"],
      relations: ["users", "admins"]
    });
    if (!room)
      throw new NotFoundException(`Room ${roomId} not found`);

    if (!room.admins.find(admin => admin.id === userIdAdmin))
      throw new ConflictException(`User ${userIdAdmin} is not admin of room ${roomId}`);

    const adminToDel: UserEntity = await this.userRepository.findOne({
      where: { id: userIdAdmin },
      select: ["id"],
      relations: ["roomUsers", "roomAdmins"]
    });
    if (!adminToDel)
      throw new NotFoundException(`User ${userIdAdmin} not found`);

    adminToDel.roomAdmins = adminToDel.roomAdmins.filter(r => r.id !== room.id);
    await adminToDel.save();
    room.admins = room.admins.filter(u => u.id !== adminToDel.id);
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
      .where('chat-room.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }




  async muteUser(
    roomId: bigint,
    userIdToBeMuted: bigint
  ): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id", "status"],
      relations: ["users", "mutedUsers"]
    });

    if (room.mutedUsers.find(muted => muted.id === userIdToBeMuted))
      throw new ConflictException(`User ${userIdToBeMuted} is already muted in room ${roomId}`);

    const userToBeMuted: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeMuted },
      select: ["id"],
      relations: ["roomUsers", "roomMutedUsers"]
    });

    if (!userToBeMuted)
      throw new NotFoundException(`User ${userIdToBeMuted} not found`);

    userToBeMuted.roomMutedUsers = [...userToBeMuted.roomMutedUsers, room];
    await userToBeMuted.save();

    room.mutedUsers = [...room.mutedUsers, userToBeMuted];
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
      .where('chat-room.id = :roomId', { roomId: room.id })
      .getOne();
    return resultRoom;
  }


  async demuteUser(
    roomId: bigint,
    userIdToBeDemuted: bigint
  ): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.findOne({
      where: { id: roomId },
      select: ["id", "status"],
      relations: ["users", "mutedUsers"]
    });

    if (!room.mutedUsers.find(muted => muted.id === userIdToBeDemuted))
      throw new ConflictException(`User ${userIdToBeDemuted} is not muted in room ${roomId}`);

    const userToBeDemuted: UserEntity = await this.userRepository.findOne({
      where: { id: userIdToBeDemuted },
      select: ["id"],
      relations: ["roomUsers", "roomMutedUsers"]
    });

    if (!userToBeDemuted)
      throw new NotFoundException(`User ${userIdToBeDemuted} not found`);

    userToBeDemuted.roomMutedUsers = userToBeDemuted.roomMutedUsers.filter(r => r.id !== room.id);
    await userToBeDemuted.save();

    room.mutedUsers = room.mutedUsers.filter(u => u.id !== userToBeDemuted.id);
    await room.save();

    const resultRoom: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
      .where('chat-room.id = :roomId', { roomId: room.id })
      .getOne();
    console.log("user demuted")
    return resultRoom;
  }














  /* ************************************************ */
  /*                      MESSAGE                     */
  /* ************************************************ */

  async createMessage(
    newMessage: ChatCreateMsgDTO,
    userId: bigint,
    roomId: bigint)
    : Promise<ChatMsgInterface> {

    const userSend: UserEntity = await UserEntity.findOne({
      where: { id: userId },
      select: ["id", "firstName", "lastName", "login"],
      relations: ["chatMessages"]
    });
    console.error("userSend", userSend);

    const room: ChatRoomEntity = await ChatRoomEntity.findOne({
      where: { id: roomId },
      select: ["id", "status"],
      relations: ["messages"]
    });
    if (!room)
      throw new NotFoundException(`Room ${roomId} not found`);

    // const chatMessageEntity: ChatMessageEntity = new ChatMessageEntity();
    // chatMessageEntity.text = newMessage.text;
    // chatMessageEntity.ownerUser = userSend;

    const message: ChatMessageEntity = await ChatMessageEntity.save({
      text: newMessage.text,
    });
    if (!message)
      throw new Error("Message not created");

    userSend.chatMessages = [...userSend.chatMessages, message];
    await userSend.save();
    room.messages = [...room.messages, message];
    await room.save();

    const messageToSave: ChatMsgInterface = {
      id: message.id,
      text: message.text,
      room: {
        id: room.id,
        status: room.status,
        // name: room.name
      },
      user: {
        id: userSend.id,
        firstName: userSend.firstName,
        lastName: userSend.lastName,
        login: userSend.login
      },
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };

    this.eventEmitter.emit('chat-message.created', new ChatMessageCreatedEvent(messageToSave));

    return messageToSave;
  }



  /* ************************************************ */
  /*                      ADMIN                       */
  /* ************************************************ */

  async getAllRooms(): Promise<ChatRoomInterface[]> {
    const rooms: ChatRoomEntity[] = await ChatRoomEntity.find({
      select: ["id", "status"],
      relations: ["messages", "ownerUser", "users", "admins", "bannedUsers", "mutedUsers"]
    });
    const result: ChatRoomInterface[] = rooms.map((room: ChatRoomEntity) => {
      return { ...room }
    });

    return result;
  }

  async getRoom(roomId: bigint): Promise<ChatRoomInterface> {
    const room: ChatRoomInterface = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .leftJoinAndSelect('chat-room.users', 'users')
      .leftJoinAndSelect('chat-room.admins', 'admins')
      .leftJoinAndSelect('chat-room.bannedUsers', 'bannedUsers')
      .leftJoinAndSelect('chat-room.mutedUsers', 'mutedUsers')
      .leftJoinAndSelect('chat-room.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'ownerMessage')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login', 'users.id', 'users.firstName', 'users.lastName', 'users.login', 'admins.id', 'admins.firstName', 'admins.lastName', 'admins.login', 'bannedUsers.id', 'bannedUsers.firstName', 'bannedUsers.lastName', 'bannedUsers.login', 'mutedUsers.id', 'mutedUsers.firstName', 'mutedUsers.lastName', 'mutedUsers.login', 'messages.id', 'messages.text', 'messages.createdAt', 'ownerMessage.id', 'ownerMessage.firstName', 'ownerMessage.lastName', 'ownerMessage.login'])
      .where('chat-room.id = :roomId', { roomId })
      .getOne();
    return room;
  }

  async getRoomAllMessages(roomId: bigint): Promise<ChatRoomInterface> {
    const room: ChatRoomEntity = await this.roomRepository.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.messages', 'messages')
      .leftJoinAndSelect('messages.user', 'ownerMessage')
      .select(['chat-room.id', 'chat-room.status', 'messages.id', 'messages.text', 'messages.createdAt', 'ownerMessage.id', 'ownerMessage.firstName', 'ownerMessage.lastName', 'ownerMessage.login'])
      .where('chat-room.id = :roomId', { roomId })
      .orderBy('messages.createdAt', 'DESC')
      .getOne()
    const result: ChatRoomInterface = { ...room };
    return result;
  }













}
