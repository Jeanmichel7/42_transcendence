import { MessageInterface } from 'src/modules/messagerie/interfaces/message.interface';

export interface UserInterface {
    id: bigint,
    firstName: string,
    lastName: string,
    login: string,
    email?: string,
    status?: string,
    password?: string,
    description?: string,
    avatar?: string,
    role?: string,
    is2FAEnabled?: boolean,
    secret2FA?: string,
    messagesSend?: MessageInterface[],
    messagesReceive?: MessageInterface[],
    createdAt?: Date,
    updatedAt?: Date,
}