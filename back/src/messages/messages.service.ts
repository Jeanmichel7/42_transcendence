import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { MessageInfo } from 'src/typeorm';
import { UserInfo } from 'src/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/message-create.event';


@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageInfo) private readonly msgRepository: Repository<MessageInfo>,
        private eventEmitter: EventEmitter2
    ) { }

    async findOne(id: bigint): Promise<MessageInfo> {
        const result = await this.msgRepository.findOneBy({ id: id });
        if (!result)
            throw new NotFoundException(`Message with id ${id} not found`);
        return result;
    }

    async findOneBySenderAndReceiver(userIdFrom: bigint, userIdTo: bigint): Promise<MessageInfo> {
        const result = await this.msgRepository.findOneBy({ ownerUser: userIdFrom, destUser: userIdTo });
        if (!result)
            throw new NotFoundException(`Message with id ${userIdFrom} not found`);
        return result;

    }
    async findAll(): Promise<MessageInfo[]> {
        const messages = this.msgRepository.find();
        if (!messages)
            throw new NotFoundException(`Messages not found`);
        return messages;
    }


    async createMessage(
        message: CreateMessageDto,
        userSend: UserInfo,
        userReceive: UserInfo
    ): Promise<CreateMessageDto> {
        console.error("msg recu : ", message)
        const newMessage = await this.msgRepository.save({
            text: message.text,
        });

        userSend.messagesSend = [...userSend.messagesSend, newMessage];
        await userSend.save();
        userReceive.messagesReceive = [...userReceive.messagesReceive, newMessage];
        await userReceive.save();

        // const test = new OrderCreatedEvent();
        // test.text = "test";
        // this.eventEmitter.emit('order.created', test);

        return message;
    }

    async patchMessage(
        id: bigint,
        updateMessage: CreateMessageDto
    ): Promise<MessageInfo> {
        // console.log("updateMessage : ", updateMessage)

        let messageToUpdate = await this.findOne(id)
        // console.log("messageToUpdate : ", messageToUpdate)

        if (!messageToUpdate)
            throw new NotFoundException(`Message with id ${id} not found`);

        // check auth

        await this.msgRepository.update(
            { id: id },
            {
                text: updateMessage.text,
                updateAt: () => 'CURRENT_TIMESTAMP'
            }
        );

        const result: MessageInfo = await this.findOne(id);
        return result;
    }

    async deleteMessage(id: bigint): Promise<MessageInfo> {
        const result = await this.findOne(id);
        if (!result)
            throw new NotFoundException(`Message with id ${id} not found`);

        // check auth

        await this.msgRepository.delete({ id: id });
        return result;
    }

}
