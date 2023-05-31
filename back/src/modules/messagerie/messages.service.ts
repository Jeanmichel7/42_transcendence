import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { MessageCreateDTO } from './dto/message.create.dto';
import { MessageInterface } from './interfaces/message.interface';
import { MessageBtwTwoUserInterface } from './interfaces/messageBetweenTwoUsers.interface';
import { MessageCreatedEvent } from './event/message.event';
import { UserInterface } from '../users/interfaces/users.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findOne(id: bigint): Promise<MessageInterface> {
    const message: MessageEntity = await this.messageRepository.findOneBy({
      id: id,
    });
    if (!message)
      throw new NotFoundException(`Message with id ${id} not found`);
    const result: MessageInterface = message;
    return result;
  }

  async getAllMessageOfUser(userId: bigint): Promise<MessageInterface[]> {
    const messages: MessageEntity[] = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.ownerUser', 'ownerUser')
      .leftJoinAndSelect('message.destUser', 'destUser')
      .select([
        'message',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
        'destUser.id',
        'destUser.firstName',
        'destUser.lastName',
        'destUser.login',
      ])
      .where('(ownerUser.id = :userId OR destUser.id = :userId)', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();
    return messages;
  }

  async getMessagesBetweenUsers(
    userIdFrom: bigint,
    userIdTo: bigint,
  ): Promise<MessageBtwTwoUserInterface[]> {
    const messages: MessageEntity[] = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.ownerUser', 'ownerUser')
      .leftJoinAndSelect('message.destUser', 'destUser')
      .select([
        'message',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
        'ownerUser.avatar',
        'destUser.id',
        'destUser.firstName',
        'destUser.lastName',
        'destUser.login',
      ])
      .where(
        '(ownerUser.id = :userIdFrom AND destUser.id = :userIdTo) OR (ownerUser.id = :userIdTo AND destUser.id = :userIdFrom)',
        { userIdFrom, userIdTo },
      )
      .orderBy('message.createdAt', 'ASC')
      .getMany();

    const result: MessageBtwTwoUserInterface[] = messages;
    return result;
  }

  async createMessage(
    messageToSave: MessageCreateDTO,
    userIdFrom: bigint,
    userIdTo: bigint,
  ): Promise<MessageInterface> {
    const userSend: UserEntity = await this.userRepository.findOne({
      where: { id: userIdFrom },
      select: ['id', 'login'],
      relations: ['messagesSend'],
    });

    const userReceive: UserEntity = await this.userRepository.findOne({
      where: { id: userIdTo },
      select: ['id'],
      relations: ['messagesReceive', 'blocked'],
    });

    // test if userSend is blocked by userReceive
    if (userReceive.blocked.map((user) => user.id).includes(userSend.id)) {
      throw new ForbiddenException(
        `You can't send a message to ${userReceive.login}, you are blocked`,
      );
    }

    if (!userReceive)
      throw new NotFoundException(`User with id ${userIdTo} not found`);
    if (userSend.id === userReceive.id)
      throw new NotFoundException(
        `Hey ${userSend.login}, you can't send a message to yourself !`,
      );

    const newMessage: MessageEntity = await MessageEntity.save({
      text: messageToSave.text,
    });
    if (!newMessage) throw new NotFoundException(`Message not created`);
    userSend.messagesSend = [...userSend.messagesSend, newMessage];
    await userSend.save();
    userReceive.messagesReceive = [...userReceive.messagesReceive, newMessage];
    await userReceive.save();

    // const result = await this.messageRepository
    // .createQueryBuilder("message")
    // .leftJoinAndSelect("message.ownerUser", "ownerUser")
    // .leftJoinAndSelect("message.destUser", "destUser")
    // .select([
    // 	'message',
    // 	'ownerUser.id','ownerUser.firstName','ownerUser.lastName','ownerUser.login',
    // 	'destUser.id', 'destUser.firstName', 'destUser.lastName', 'destUser.login'
    // ])
    // .where("message.id = :id", { id: newMessage.id })
    // .getOne();

    const result: MessageInterface = await this.messageRepository.findOne({
      // select: ["id", "text", "createdAt", "updatedAt" ],
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        ownerUser: {
          id: true,
          firstName: true,
          lastName: true,
          login: true,
          avatar: true,
        },
        destUser: {
          id: true,
          firstName: true,
          lastName: true,
          login: true,
        },
      },
      relations: {
        ownerUser: true,
        destUser: true,
      },
      where: { id: newMessage.id },
    });
    console.error('emet event message.created');
    this.eventEmitter.emit('message.created', new MessageCreatedEvent(result));
    return result;
  }

  async patchMessage(
    user: UserInterface,
    messageId: bigint,
    newMessage: MessageCreateDTO,
  ): Promise<MessageInterface> {
    const messageToUpdate = await this.findMsgWithRelationOwner(messageId);
    if (!messageToUpdate)
      throw new NotFoundException(`Message with id ${messageId} not found`);

    if (messageToUpdate.ownerUser.id !== user.id && user.role !== 'admin')
      throw new ForbiddenException(`You can't update this message`);

    await this.messageRepository.update(
      { id: messageId },
      {
        text: newMessage.text,
        updatedAt: new Date(),
      },
    );

    const result: MessageInterface = await this.findOne(messageId);
    return result;
  }

  async deleteMessage(
    user: UserInterface,
    messageId: bigint,
  ): Promise<boolean> {
    const message = await this.findMsgWithRelationOwner(messageId);
    if (!message)
      throw new NotFoundException(`Message with id ${messageId} not found`);

    if (message.ownerUser.id !== user.id && user.role !== 'admin')
      throw new ForbiddenException(`You can't update this message`);

    const result = await this.messageRepository.delete({ id: messageId });
    if (result.affected === 0) return false;
    return true;
  }

  /* ------------------ UTILS ------------------ */
  private async findMsgWithRelationOwner(
    id: bigint,
  ): Promise<MessageInterface> {
    const message: MessageEntity = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.ownerUser', 'ownerUser')
      .select([
        'message',
        'ownerUser.id',
        'ownerUser.firstName',
        'ownerUser.lastName',
        'ownerUser.login',
      ])
      .where('message.id = :id', { id })
      .getOne();

    if (!message)
      throw new NotFoundException(`Message with id ${id} not found`);

    const result: MessageInterface = message;
    return result;
  }

  /* ------------------ ADMIN ------------------ */

  async findAll(): Promise<MessageInterface[]> {
    const messages: MessageEntity[] = await this.messageRepository.find();
    if (!messages) throw new NotFoundException(`Messages not found`);
    const result: MessageInterface[] = { ...messages };
    return result;
  }
}
