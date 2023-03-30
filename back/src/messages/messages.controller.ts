import { Controller, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, HttpCode, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';

import { Message } from './interfaces/messages.interface';

import { MessageService } from './messages.service';
import { UsersService } from 'src/users/users.service';

import { CreateMessageDto } from './dto/create-message.dto';


@Controller('messages')
export class MessageController {
    constructor(
        private readonly MessageService: MessageService,
        private UsersService: UsersService,
    ) {}

    @Get()
    async findAll(): Promise<Message[]> {
        const result = await this.MessageService.findAll();
        return result;
    }
    
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id:bigint): Promise<Message> {
        const result = await this.MessageService.findOne(id);
        return result;
    }

    @Get('/user/:id')
    async findAllOfUser(@Param('id', ParseIntPipe) id: bigint)
    : Promise<Message[]> {
        const user = await this.UsersService.findOneWithMessages(id);
        // console.log("user : ", user);

        const result = user.messagesReceive;
        return result;
    }

    @Post('user/:userId/:userDestId')
    @UsePipes(ValidationPipe)
    async createMessage(
        @Param('userId', ParseIntPipe) userId: bigint,
        @Param('userDestId', ParseIntPipe) userDestId: bigint,
        @Body() newMessage: CreateMessageDto
    ): Promise<Message> {
        // console.error("new message : ", newMessage);

        const userSend = await this.UsersService.findOneWithMessages(userId);
        // console.log("user : ", userSend);
        
        const userReceive = await this.UsersService.findOneWithMessages(userDestId);
        // console.log("user : ", userSend);

        const message = await this.MessageService.createMessage(newMessage, userSend, userReceive);
        // console.log("message : ", message);

        return message;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async patchMessage(@Param('id', ParseIntPipe) id: bigint, @Body() updateMessage: CreateMessageDto)
    : Promise<Message> {
        // console.error("update message id: ", id);
        // console.error("update message body: ", updateMessage);
        const result = await this.MessageService.patchMessage(id, updateMessage);
        return result;
    }

    @Delete(':id')
    async deleteMessage(@Param('id', ParseIntPipe) id: bigint): Promise<HttpStatus> {
        await this.MessageService.deleteMessage(id);
        return HttpStatus.NO_CONTENT; // 204
    }


}
