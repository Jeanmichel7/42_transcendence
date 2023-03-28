import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chats.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    getChat(): any[] {
        return this.chatService.findAll();
    }
    
    @Get('test')
    test(): string {
        return 'test';
    }
}
