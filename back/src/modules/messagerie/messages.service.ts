import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Equal, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { MessageCreateDTO } from './dto/message.create.dto';
import { MessageInterface } from './interfaces/messages.interface';
import { UserInterface } from '../users/interfaces/users.interface';
import { MessageBtwTwoUserInterface } from './interfaces/messagesBetweenTwoUsers.interface';



@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
	) { }

	async findOne(id: bigint): Promise<MessageInterface> {
		const message: MessageEntity = await this.messageRepository.findOneBy({ id: id });
		if (!message)
			throw new NotFoundException(`Message with id ${id} not found`);
		const result: MessageInterface = message;
		return result;
	}

	async getAllMessageOfUser(userId: bigint): Promise<MessageInterface[]> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { id: userId },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"],
			relations: ["messagesSend", "messagesReceive"]
		});
		if (!user)
			throw new NotFoundException(`User with id ${userId} not found`);

		let allMessages: MessageInterface[];
		allMessages = [...user.messagesSend, ...user.messagesReceive];

		//trier par date...
		allMessages.sort((a, b) => {
			let d1 = new Date(a.createdAt);
			let d2 = new Date(b.createdAt);
			if( d1.getTime() < d2.getTime() ) return 1;
			if( d1.getTime() > d2.getTime() ) return -1;
			return 0;
		});

		return allMessages;
	}

	async getMessagesBetweenUsers(userIdFrom: bigint, userIdTo: bigint): Promise<MessageBtwTwoUserInterface[]> {
		const messages: MessageEntity[] = await this.messageRepository.createQueryBuilder('message')
    .leftJoinAndSelect('message.ownerUser', 'ownerUser')
    .leftJoinAndSelect('message.destUser', 'destUser')
		.select(['message', 'ownerUser.firstName', 'destUser.firstName', 'destUser.lastName', 'ownerUser.lastName'])
    .where(
      '(ownerUser.id = :userIdFrom AND destUser.id = :userIdTo) OR (ownerUser.id = :userIdTo AND destUser.id = :userIdFrom)',
      { userIdFrom, userIdTo }
    )
    .getMany();

		const result: MessageBtwTwoUserInterface[] = messages.map(e=>{
			return {
				id: e.id,
				text: e.text,
				createdAt: e.createdAt,
				updatedAt: e.updatedAt,
				firstNameOwner: e.ownerUser.firstName,
				lastNameOwner: e.destUser.lastName
			}
		})
		return result;
	}


	// async findOneBySenderAndReceiver(userIdFrom: bigint, userIdTo: bigint): Promise<MessageEntity> {
	// 	const result = await this.msgRepository.findOneBy({ ownerUser: userIdFrom, destUser: userIdTo });
	// 	if (!result)
	// 		throw new NotFoundException(`Message with id ${userIdFrom} not found`);
	// 	return result;
	// }

	async findAll(): Promise<MessageInterface[]> {
		const messages: MessageEntity[] = await this.messageRepository.find();
		if (!messages)
			throw new NotFoundException(`Messages not found`);
		const result: MessageInterface[] = { ...messages }
		return result;
	}

	async createMessage(
		message: MessageCreateDTO,
		userIdFrom: bigint,
		userIdTo: bigint
	): Promise<MessageInterface> {
		console.error("avant save : ", message);

		const userSend: UserEntity = await this.userRepository.findOne({
			where: { id: userIdFrom },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"],
			relations: ["messagesSend", "messagesReceive"]
		});

		const userReceive: UserEntity = await this.userRepository.findOne({
			where: { id: userIdTo },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"],
			relations: ["messagesSend", "messagesReceive"]
		});

		if (!userReceive)
			throw new NotFoundException(`User with id ${userIdTo} not found`);
		if (userSend.id === userReceive.id)
			throw new NotFoundException(`Hey ${userSend.login}, you can't send a message to yourself !`);

		// const newMessage: Partial<MessageEntity> = {};
		// newMessage.text = message.text;
		// newMessage.ownerUser = userSend.id;
		// newMessage.destUser = userReceive.id;

		const newMessage: MessageEntity = await this.messageRepository.save({
			text: message.text,
			ownerUser: userSend,
			destUser: userReceive,
		});
		console.error("apres save : ", newMessage);
		// userSend.messagesSend = [...userSend.messagesSend, newMessage];
		// await userSend.save();
		// userReceive.messagesReceive = [...userReceive.messagesReceive, newMessage];
		// await userReceive.save();
		
		const result: MessageInterface = { ...newMessage };
		return result;
	}

	async patchMessage(
		id: bigint,
		updateMessage: MessageCreateDTO
	): Promise<MessageInterface> {
		// console.log("updateMessage : ", updateMessage)

		let messageToUpdate = await this.findOne(id)
		// console.log("messageToUpdate : ", messageToUpdate)

		if (!messageToUpdate)
			throw new NotFoundException(`Message with id ${id} not found`);

		await this.messageRepository.update(
			{ id: id },
			{
				text: updateMessage.text,
				updatedAt: () => 'CURRENT_TIMESTAMP'
			}
		);

		const result: MessageInterface = await this.findOne(id);
		return result;
	}

	async deleteMessage(id: bigint): Promise<MessageInterface> {
		const result = await this.findOne(id);
		if (!result)
			throw new NotFoundException(`Message with id ${id} not found`);

		// check auth

		await this.messageRepository.delete({ id: id });
		return result;
	}

}
