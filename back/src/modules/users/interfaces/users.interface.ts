import { MessageInterface } from 'src/modules/messagerie/interfaces/messages.interface';

export interface UserInterface {
    id: bigint,
    firstName: string,
    lastName: string,
    login: string,
    email: string,
    password?: string,
    description?: string,
    avatar?: string,
    role?: string,
    is2FAEnabled?: boolean,
    messagesSend?: MessageInterface[],
    messagesReceive?: MessageInterface[],
}