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

    async findAll(): Promise<MessageInfo[]> {
        const messages = this.msgRepository.find();
        if(!messages)
            throw new NotFoundException(`Messages not found`);
        return messages;
    }

    async findAllOfUser(user) {
        console.log("user reveiced : ", user.messagesReceive)

        // let index = user.id;
        // let result = await this.msgRepository.find({
        //     where: {destUser: user.id},
        //     // relations: ["destUser", "ownerUser"]
        // });
        // console.log("result : ", result);

        // result.forEach(e => {
        //     console.error(e.destUser)
        // })
        return user.messagesReceive;
    }

    async createMessage(
        message: CreateMessageDto,
        userSend: UserInfo,
        userReceive: UserInfo
    ){
        console.log("message : ", message)
        const newMessage = await this.msgRepository.save({
            // ...message,
            // ownerUserId: userSend.id,
            // destUserId: userReceive.id,
            data: message.data,
        });

        userSend.messagesSend = [...userSend.messagesSend, newMessage];
        await userSend.save();
        userReceive.messagesReceive = [...userReceive.messagesReceive, newMessage];
        await userReceive.save();

        return newMessage;
    }

}
