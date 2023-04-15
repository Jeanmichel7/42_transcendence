import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessageEntity } from './entity/chat.message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatCreateMsgDTO} from './dto/chat.createMessage.dto';
import { ChatCreateRoomDTO } from './dto/chat.createRoom.dto';

import { ChatMsgInterface } from './interfaces/chat.message.interface';
import { Repository } from 'typeorm';
import { ChatRoomEntity, UserEntity } from 'src/config';
import { ChatRoomInterface } from './interfaces/chat.room.interface';
import { ChatMessageCreatedEvent } from './event/chat.event';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    // @InjectRepository(ChatMessageEntity) private readonly messageService: Repository<ChatMessageEntity>,
    @InjectRepository(ChatRoomEntity) private readonly roomService: Repository<ChatRoomEntity>,
		private readonly eventEmitter: EventEmitter2
  ) { }


  /* ************************************************ */
  /*                       ROOM                       */
  /* ************************************************ */

  // supprimer relation de room avec user retourner room
  // ou  plutot faire une querybuilder pour recup user et room sans user
  async createRoom(
    userId: bigint,
    roomToCreate: ChatCreateRoomDTO
  ): Promise<ChatRoomInterface> {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id"],
      relations: ["roomUsers"]
    });

    const room: ChatRoomEntity = await ChatRoomEntity.save({
      ownerUser: user,
      users: [ user ],
      admins: [ user ],
      bannedUsers: [],
      mutedUsers: [],
      ...roomToCreate
    });
    if (!room)
      throw new Error("Room not created");

    user.roomUsers = [...user.roomUsers, room];
    await user.save();

    const resultRoom: ChatRoomInterface = await this.roomService.createQueryBuilder('chat-room')
      .leftJoinAndSelect('chat-room.ownerUser', 'ownerUser')
      .select(['chat-room', 'ownerUser.id', 'ownerUser.firstName', 'ownerUser.lastName', 'ownerUser.login'])
      .where('chat-room.id = :roomId', { roomId: room.id })
      .getOne();
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
        id : room.id,
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

  async getAllRooms() {
    const rooms: ChatRoomEntity[] = await ChatRoomEntity.find({
      select: ["id", "status"],
      relations: ["messages", "ownerUser", "users", "admins", "bannedUsers", "mutedUsers"]
    });
    return rooms;
  }

}
