import { Controller, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, HttpCode, ParseIntPipe, UsePipes, ValidationPipe, Sse, UseGuards, Header, Req } from '@nestjs/common';

import { MessageService } from './messages.service';
import { MessageInterface } from './interfaces/message.interface';
import { MessageBtwTwoUserInterface } from './interfaces/messageBetweenTwoUsers.interface';

import { MessageCreateDTO } from './dto/message.create.dto';
import { MessagePatchDTO } from './dto/message.patch.dto';

import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';
// import { AuthOwnerAdmin } from 'src/modules/auth/guard/authAdminOwner.guard';
import { Public } from '../auth/decorators/public.decorator';
import { RequestWithUser } from '../users/interfaces/request.user.interface';


@Controller('messages')
export class MessageController {
	constructor(
		private readonly MessageService: MessageService,
	) { }


	// get All message of a user
	@Get()
	async findAllOfUser(
		@Req() req: RequestWithUser
	): Promise<MessageInterface[]> {
		const result: MessageInterface[] = await this.MessageService.getAllMessageOfUser(req.user.id);
		return result;
	}

	@Get('users/:userIdDest')
	async getMessages(
		@Req() req: RequestWithUser,
		@Param('userIdDest', ParseIntPipe) userIdDest: bigint,
	): Promise<MessageBtwTwoUserInterface[]>
	{
		const result: MessageBtwTwoUserInterface[] = await this.MessageService.
		getMessagesBetweenUsers(req.user.id, userIdDest);
		return result;
	}


	@Post('users/:userIdTo/send')
	@UsePipes(ValidationPipe)
	async createMessage(
		@Req() req: RequestWithUser,
		@Param('userIdTo', ParseIntPipe) userIdTo: bigint,
		@Body() newMessage: MessageCreateDTO
	): Promise<MessageInterface> {
		const message: MessageInterface = await this.MessageService.
		createMessage(newMessage, req.user.id, userIdTo);
		return message;
	}

	@Patch(':messageId')
	@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
	async patchMessage(
		@Req() req: RequestWithUser,
		@Param('messageId', ParseIntPipe) id: bigint,
		@Body() updateMessage: MessagePatchDTO
	): Promise<MessageInterface> {
		const result = await this.MessageService.patchMessage(req.user, id, updateMessage);
		return result;
	}

	@Delete(':messageId/')
	async deleteMessage(
		@Param('messageId', ParseIntPipe) id: bigint,
		@Req() req: RequestWithUser
	): Promise<HttpStatus> {
		let isDelete = await this.MessageService.deleteMessage(req.user, id);
		if (isDelete)
			return HttpStatus.OK; // 200
		else
			return HttpStatus.NOT_FOUND; // 404
	}





	/* ************************************************ */
	/*                      ADMIN                       */
	/* ************************************************ */

	@Get()
	@UseGuards(AuthAdmin)
	async adminFindAll(): Promise<MessageInterface[]> {
		const result: MessageInterface[] = await this.MessageService.findAll();
		return result;
	}

	@Get(':messageId')
	@UseGuards(AuthAdmin)
	async AdminFindOne(@Param('messageId', ParseIntPipe) id: bigint): Promise<MessageInterface> {
		const result: MessageInterface = await this.MessageService.findOne(id);
		return result;
	}

	@Get('/between/:userId/and/:userIdTo')
	@UseGuards(AuthAdmin)
	async adminGetMessages(
		@Param('userId', ParseIntPipe) userId: bigint,
		@Param('userIdTo', ParseIntPipe) userIdTo: bigint,
	): Promise<MessageBtwTwoUserInterface[]>
	{
		const result: MessageBtwTwoUserInterface[] = await this.MessageService.
		getMessagesBetweenUsers(userId, userIdTo);
		return result;
	}
	
}
