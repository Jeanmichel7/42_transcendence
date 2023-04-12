import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Equal, Repository } from 'typeorm';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { MessageCreateDTO } from './dto/message.create.dto';
import { MessageInterface } from './interfaces/message.interface';
import { MessageBtwTwoUserInterface } from './interfaces/messageBetweenTwoUsers.interface';
import { MessageCreatedEvent } from './event/message.event';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		private readonly eventEmitter: EventEmitter2,
		
		) { }

	async findAll(): Promise<MessageInterface[]> {
		const messages: MessageEntity[] = await this.messageRepository.find();
		if (!messages)
			throw new NotFoundException(`Messages not found`);
		const result: MessageInterface[] = { ...messages }
		return result;
	}

	async findOne(id: bigint): Promise<MessageInterface> {
		const message: MessageEntity = await this.messageRepository.findOneBy({ id: id });
		if (!message)
			throw new NotFoundException(`Message with id ${id} not found`);
		const result: MessageInterface = message;
		return result;
	}

	async getAllMessageOfUser(userId: bigint): Promise<MessageInterface[]> {
		const messages: MessageEntity[] = await this.messageRepository.createQueryBuilder('message')
    .leftJoinAndSelect('message.ownerUser', 'ownerUser')
    .leftJoinAndSelect('message.destUser', 'destUser')
		.select([
			'message',
			'ownerUser.id','ownerUser.firstName', 'ownerUser.lastName','ownerUser.login',
			'destUser.id', 'destUser.firstName', 'destUser.lastName', 'destUser.login'
		])
    .where('(ownerUser.id = :userId OR destUser.id = :userId)', { userId })
		.orderBy('message.createdAt', 'DESC')
    .getMany();
		return messages;
	}

	async getMessagesBetweenUsers(
		userIdFrom: bigint,
		userIdTo: bigint
	): Promise<MessageBtwTwoUserInterface[]> {
		const messages: MessageEntity[] = await this.messageRepository.createQueryBuilder('message')
    .leftJoinAndSelect('message.ownerUser', 'ownerUser')
    .leftJoinAndSelect('message.destUser', 'destUser')
		.select([
			'message',
			'ownerUser.id','ownerUser.firstName', 'ownerUser.lastName','ownerUser.login',
			'destUser.id', 'destUser.firstName', 'destUser.lastName', 'destUser.login'
		])
    .where(
      '(ownerUser.id = :userIdFrom AND destUser.id = :userIdTo) OR (ownerUser.id = :userIdTo AND destUser.id = :userIdFrom)',
      { userIdFrom, userIdTo }
    )
		.orderBy('message.createdAt', 'DESC')
    .getMany();
		
		const result: MessageBtwTwoUserInterface[] = messages;
		return result;
	}

	async createMessage(
		messageToSave: MessageCreateDTO,
		userIdFrom: bigint,
		userIdTo: bigint
	): Promise<MessageInterface> {

		const userSend: UserEntity = await this.userRepository.findOne({
			where: { id: userIdFrom },
			select: ["id"],
			relations: ["messagesSend"]
		});

		const userReceive: UserEntity = await this.userRepository.findOne({
			where: { id: userIdTo },
			select: ["id"],
			relations: ["messagesReceive"]
		});

		if (!userReceive)
			throw new NotFoundException(`User with id ${userIdTo} not found`);
		if (userSend.id === userReceive.id)
			throw new NotFoundException(`Hey ${userSend.login}, you can't send a message to yourself !`);

		const newMessage: MessageEntity = await MessageEntity.save({
			text: messageToSave.text,
		});
		if(!newMessage)
			throw new NotFoundException(`Message not created`);
		// newMessage.ownerUser = userSend;
		// newMessage.destUser = userReceive;
		// await newMessage.save();
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
		
		const result:MessageInterface = await this.messageRepository.findOne({
			// select: ["id", "text", "createdAt", "updatedAt" ],
			select: {
				id: true, text: true, createdAt: true, updatedAt: true,
				ownerUser: {
					id: true,
					firstName: true,
					lastName: true,
					login: true,
				},
				destUser: {
					id: true,
					firstName: true,
					lastName: true,
					login: true,
				}
			},
			relations: {
				ownerUser: true,
				destUser: true
			},
			where: { id: newMessage.id },
		});
		this.eventEmitter.emit('message.created', new MessageCreatedEvent(result));
		return result;
	}

	async patchMessage(
		id: bigint,
		updateMessage: MessageCreateDTO
	): Promise<MessageInterface> {
		let messageToUpdate = await this.findOne(id)
		if (!messageToUpdate)
			throw new NotFoundException(`Message with id ${id} not found`);

		await this.messageRepository.update({ id: id }, {
				text: updateMessage.text,
				updatedAt: new Date()
			}
		);

		const result: MessageInterface = await this.findOne(id);
		return result;
	}

	async deleteMessage(messageId: bigint): Promise<boolean> {
		const message = await this.findOne(messageId);
		if (!message)
			throw new NotFoundException(`Message with id ${messageId} not found`);

		let result = await this.messageRepository.delete({ id: messageId });
		if (result.affected === 0)
			return false
		return true;
	}

}

