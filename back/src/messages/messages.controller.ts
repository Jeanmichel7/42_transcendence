import { Controller, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, HttpCode, ParseIntPipe, UsePipes, ValidationPipe, Sse, UseGuards, Header } from '@nestjs/common';
import { EventEmitter2, OnEvent,  } from '@nestjs/event-emitter';


import { MessageService } from './messages.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './interfaces/messages.interface';
import { Public } from 'src/auth/decorators/public.decorator';

import { Request, Response } from 'express';
import { Req, Res} from '@nestjs/common';
import { OrderCreatedEvent } from './events/message-create.event';
import { BehaviorSubject, Observable, Subject, from, interval, map } from 'rxjs';
import { AuthOwnUserGuard } from 'src/auth/guard/authOwnUser.guard';


interface MessageEvent {
    data: string|object;
}

@Controller('messages')
export class MessageController {
    constructor(
        private readonly MessageService: MessageService,
        private UsersService: UsersService,
        private AuthService: AuthService,
        private eventEmitter: EventEmitter2,
    ) {}

    private data: string = ""
    private postCalled$ = new BehaviorSubject<boolean>(false);
    private data$ = new Subject<{ data: string }>();
        
    @Get()
    @Public()
    async findAll(@Req() req: Request, @Res() res: Response): Promise<Message[]> {
        const result = await this.MessageService.findAll();

        // res.setHeader('Content-Type', 'text/event-stream');
        // res.send(result)
        return result;
    }
    
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id:bigint): Promise<Message> {
        const result = await this.MessageService.findOne(id);
        return result;
    }

    // get All message of a user
    @Get('/user/:id')
    async findAllOfUser(@Param('id', ParseIntPipe) id: bigint)
    : Promise<Message[]> {
        const user = await this.UsersService.findOneWithMessages(id);
        // console.log("user : ", user);
        const result = user.messagesReceive;
        return result;
    }
    
    // get All message of a user from another user
    @Get('/from/:userIdFrom/to/:userIdTo')
    async getMessages(
        @Param('userIdFrom', ParseIntPipe) userIdFrom: bigint,
        @Param('userIdTo', ParseIntPipe) userIdTo: bigint,
    ) {
        







    }


    // @Sse('sse')
    // sse(): Observable<MessageEvent> {
    //     return interval(1000).pipe(
    //     map((_) => ({ data: { hello: 'world' } } as MessageEvent)),
    //     );
    // }

    
    // @Public()
    // @Sse('event/from/:userIdFrom/to/:userIdTo')
    // sendEvent(
    //     @Param('userIdFrom', ParseIntPipe) userIdFrom: bigint,
    //     @Param('userIdTo', ParseIntPipe) userIdTo: bigint,
    // ): Observable<MessageEvent> {
    //     console.error("sendEvent")

    //     const event = `event/from/${userIdFrom}/to/${userIdTo}`;
    //     // const test = from(
    //     //     this.MessageService.findOneBySenderAndReceiver(userIdFrom, userIdTo)
    //     // ).pipe(
    //     //     map((message) => ({
    //     //     event,
    //     //     data: message,
    //     //     }))
    //     // );
    //     // console.error("test : ", test)

    //     const test = new Observable<MessageEvent>(observer => {
    //         observer.next({
    //             data: "data"
    //         });
    //     });

    //     // // let test = interval(1000).pipe(
    //     // //     map((num: number) => ({
    //     // //         data: "nlalanlanalanla" + num
    //     // //     })),
    //     // // );
    //     // // console.error("test : ", test)
    //     return test
    // }

    // @Public()
    // @OnEvent('newMessage')
    // handleEvent(message: Message) {
    //     console.log("sendEvent : ", message)
    //     // const userIdFrom = message.ownerUser;
    //     // const userIdTo = message.destUser;

    //     // Create the event name using the user IDs
    //     const eventName = `event/from/2/to/1`;

    //     // Send the message as the payload of the event
    //     this.eventEmitter.emit(eventName, message);
    // }

    // @UseGuards(AuthOwnUserGuard)
    @Sse('/event/from/:userIdFrom/to/:userIdTo')
    stream(
        @Param('userIdFrom', ParseIntPipe) userIdFrom: bigint,
        @Param('userIdTo', ParseIntPipe) userIdTo: bigint,
        @Req() req: Request,
    ): Observable<any> {
        console.error("stream", req)
        

        /*
        verifier que l'user est bien connecté
        verifier que l'user est bien le proprietaire du message ?
        verifier que l'user est bien le destinataire du message
        */

        // const actuelUser = this.AuthService.getActuelUser(req.header);
        // console.error("actuelUser : ", actuelUser)

        let truc = new Observable((observer) => {
            this.postCalled$.subscribe((postCalled) => {


                console.error("stream", req)

                // Vérifie si la fonction @Post a été appelée
                if (postCalled) {
                    // Envoyer les données stockées au front-end
                    this.data$.next({ data: this.data });
                    this.data = "";
                }
            });
            
            // Envoyer les données stockées au front-end
            this.data$.subscribe((data) => {
                observer.next(data);
            });
        });
        this.data = "";

        return truc;
        // let truc = new Observable((observer) => {
        //     setInterval(() => {
        //         observer.next({ data: this.data.join('\n') });
        //     }, 1000);
        // });
        // return truc;
    }

    // @Sse('/event/from/2/to/1')
    // stream(): { data: string } {
    //     return { data: this.data.join('\n') };
    // }

    @Post('/from/:userIdFrom/to/:userIdTo')
    @UsePipes(ValidationPipe)
    async createMessage(
        @Param('userIdFrom', ParseIntPipe) userIdFrom: bigint,
        @Param('userIdTo', ParseIntPipe) userIdTo: bigint,
        @Body() newMessage: CreateMessageDto
    ) {
        const userSend = await this.UsersService.findOneWithMessages(userIdFrom);
        const userReceive = await this.UsersService.findOneWithMessages(userIdTo);
        const message = await this.MessageService.createMessage(newMessage, userSend, userReceive);

        this.data = message.text;
        this.postCalled$.next(true);
        // this.eventEmitter.emit('newMessage', message);

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
