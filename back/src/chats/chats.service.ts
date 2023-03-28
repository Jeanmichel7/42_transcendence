import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
    elem: object[] = [
        {
            id: 1,
            text: 'Hello World!',
            user: {
                id: 1,
                name: 'John Doe',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            }
        },
        {
            id: 2,
            text: 'Hello World!',
            user: {
                id: 2,
                name: 'John Doe',
                avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
            }
        }
    ];
    findAll(): object[] {
        return this.elem;
    }
}
