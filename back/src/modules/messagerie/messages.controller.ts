import { Controller, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, HttpCode, ParseIntPipe, UsePipes, ValidationPipe, Sse, UseGuards, Header } from '@nestjs/common';

import { MessageService } from './messages.service';
import { UsersService } from 'src/modules/users/users.service';

import { MessageCreateDTO } from './dto/message.create.dto';
import { MessageInterface } from './interfaces/messages.interface';
import { UserInterface } from '../users/interfaces/users.interface';
import { UserEntity } from '../users/entity/users.entity';

import { Public } from 'src/modules/auth/decorators/public.decorator';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';
import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
import { MessageBtwTwoUserInterface } from './interfaces/messagesBetweenTwoUsers.interface';

@Controller('messages')
export class MessageController {
	constructor(
		private readonly MessageService: MessageService,
		private UsersService: UsersService,
		// private AuthService: AuthService,
	) { }

	@Get()
	async findAll(): Promise<MessageInterface[]> {
		const result: MessageInterface[] = await this.MessageService.findAll();
		return result;
	}

	@Get(':messageId')
	// @UseGuards(AuthOwnUserGuard)
	async findOne(@Param('messageId', ParseIntPipe) id: bigint): Promise<MessageInterface> {
		const result: MessageInterface = await this.MessageService.findOne(id);
		return result;
	}

	// get All message of a user
	@Get('/user/:userId')
	// @UseGuards(AuthOwnOrAdminGuard)
	async findAllOfUser(@Param('userId', ParseIntPipe) userId: bigint): Promise<MessageInterface[]> {
		const result: MessageInterface[] = await this.MessageService.getAllMessageOfUser(userId);
		return result;
	}

	// get All message of a user from another user
	@Get('/between/:userId/and/:userIdTo')
	// @UseGuards(AuthOwnOrAdminGuard)
	async getMessages(
		@Param('userId', ParseIntPipe) userId: bigint,
		@Param('userIdTo', ParseIntPipe) userIdTo: bigint,
	): Promise<MessageBtwTwoUserInterface[]>
	{
		const result: MessageBtwTwoUserInterface[] = await this.MessageService.getMessagesBetweenUsers(userId, userIdTo);
		return result;
	}


	@Post('/from/:userId/to/:userIdTo')
	@UseGuards(AuthOwner)
	@UsePipes(ValidationPipe)
	async createMessage(
		@Param('userId', ParseIntPipe) userId: bigint,
		@Param('userIdTo', ParseIntPipe) userIdTo: bigint,
		@Body() newMessage: MessageCreateDTO
	): Promise<MessageInterface> {
		const message: MessageInterface = await this.MessageService.createMessage(newMessage, userId, userIdTo);

		return message;
	}

	@Patch(':id')
	@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
	async patchMessage(@Param('id', ParseIntPipe) id: bigint, @Body() updateMessage: MessageCreateDTO)
		: Promise<MessageInterface> {
		const result = await this.MessageService.patchMessage(id, updateMessage);
		return result;
	}

	@Delete(':id')
	async deleteMessage(@Param('id', ParseIntPipe) id: bigint): Promise<HttpStatus> {
		await this.MessageService.deleteMessage(id);
		return HttpStatus.NO_CONTENT; // 204
	}


}
