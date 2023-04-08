import { Controller, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, HttpCode, ParseIntPipe, UsePipes, ValidationPipe, Sse, UseGuards, Header } from '@nestjs/common';

import { MessageService } from './messages.service';
import { MessageInterface } from './interfaces/messages.interface';
import { MessageBtwTwoUserInterface } from './interfaces/messagesBetweenTwoUsers.interface';

import { MessageCreateDTO } from './dto/message.create.dto';
import { MessagePatchDTO } from './dto/message.patch.dto';

import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';
import { AuthOwnerAdmin } from 'src/modules/auth/guard/authAdminOwner.guard';


@Controller('messages')
export class MessageController {
	constructor(
		private readonly MessageService: MessageService,
		// private UsersService: UsersService,
		// private AuthService: AuthService,
	) { }

	@Get()
	// @UseGuards(AuthAdmin)
	async findAll(): Promise<MessageInterface[]> {
		const result: MessageInterface[] = await this.MessageService.findAll();
		return result;
	}

	@Get(':messageId')
	@UseGuards(AuthAdmin)
	async findOne(@Param('messageId', ParseIntPipe) id: bigint): Promise<MessageInterface> {
		const result: MessageInterface = await this.MessageService.findOne(id);
		return result;
	}

	// get All message of a user
	@Get('/user/:userId')
	@UseGuards(AuthOwnerAdmin)
	async findAllOfUser(@Param('userId', ParseIntPipe) userId: bigint): Promise<MessageInterface[]> {
		const result: MessageInterface[] = await this.MessageService.getAllMessageOfUser(userId);
		return result;
	}

	@Get('/between/:userId/and/:userIdTo')
	@UseGuards(AuthOwnerAdmin)
	async getMessages(
		@Param('userId', ParseIntPipe) userId: bigint,
		@Param('userIdTo', ParseIntPipe) userIdTo: bigint,
	): Promise<MessageBtwTwoUserInterface[]>
	{
		const result: MessageBtwTwoUserInterface[] = await this.MessageService.
		getMessagesBetweenUsers(userId, userIdTo);
		return result;
	}

	@Post('/from/:userId/to/:userIdTo')
	@UseGuards(AuthOwnerAdmin)
	@UsePipes(ValidationPipe)
	async createMessage(
		@Param('userId', ParseIntPipe) userId: bigint,
		@Param('userIdTo', ParseIntPipe) userIdTo: bigint,
		@Body() newMessage: MessageCreateDTO
	): Promise<MessageInterface> {
		const message: MessageInterface = await this.MessageService.
		createMessage(newMessage, userId, userIdTo);
		return message;
	}

	@Patch(':messageId/user/:userId')
	@UseGuards(AuthOwnerAdmin)
	@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
	async patchMessage(
		@Param('messageId', ParseIntPipe) id: bigint,
		@Body() updateMessage: MessagePatchDTO
	): Promise<MessageInterface> {
		const result = await this.MessageService.patchMessage(id, updateMessage);
		return result;
	}

	@Delete('/:messageId/user/:userId')
	@UseGuards(AuthOwnerAdmin)
	async deleteMessage(@Param('messageId', ParseIntPipe) id: bigint): Promise<HttpStatus> {
		let isDelete = await this.MessageService.deleteMessage(id);
		if (isDelete) 
			return HttpStatus.OK; // 200
		else
			return HttpStatus.NOT_FOUND; // 404
	}

}
