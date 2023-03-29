import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MessageInfo } from 'src/typeorm';
import { UserInfo } from 'src/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';


@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageInfo) private readonly msgRepository: Repository<MessageInfo>,
    ) {}

    async findOne(id: bigint): Promise<MessageInfo> {
        const result = await this.msgRepository.findOneBy({id: id});
        if(!result)
            throw new NotFoundException(`Message with id ${id} not found`);
        return result;
    }

    async findAll(): Promise<MessageInfo[]> {
        const messages = this.msgRepository.find();
        if(!messages)
            throw new NotFoundException(`Messages not found`);
        return messages;
    }

    async createMessage(
        message: CreateMessageDto,
        userSend: UserInfo,
        userReceive: UserInfo
    ): Promise<MessageInfo> {
        const newMessage = await this.msgRepository.save({
            data: message.data,
        });

        userSend.messagesSend = [...userSend.messagesSend, newMessage];
        await userSend.save();
        userReceive.messagesReceive = [...userReceive.messagesReceive, newMessage];
        await userReceive.save();

        return newMessage;
    }

    async patchMessage(
        id: bigint,
        updateMessage: CreateMessageDto
    ): Promise<MessageInfo> {
        // console.log("updateMessage : ", updateMessage)

        let messageToUpdate = await this.findOne(id)
        // console.log("messageToUpdate : ", messageToUpdate)

        if(!messageToUpdate)
            throw new NotFoundException(`Message with id ${id} not found`);
        
        // check auth

        await this.msgRepository.update(
            {id: id},
            {
                data: updateMessage.data,
                updateAt: () => 'CURRENT_TIMESTAMP'
            }
        );

        const result: MessageInfo = await this.findOne(id);
        return result;
    }

    async deleteMessage(id: bigint): Promise<MessageInfo> {
        const result = await this.findOne(id);
        if(!result)
            throw new NotFoundException(`Message with id ${id} not found`);

        // check auth

        await this.msgRepository.delete({id: id});
        return result;
    }

}
