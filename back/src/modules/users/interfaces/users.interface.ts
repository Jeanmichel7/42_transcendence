import { ChatRoomEntity } from 'src/config';
import { ChatMsgInterface } from 'src/modules/chat/interfaces/chat.message.interface';
import { ChatRoomInterface } from 'src/modules/chat/interfaces/chat.room.interface';
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
	createdAt?: Date,
	updatedAt?: Date,
	messagesSend?: MessageInterface[],
	messagesReceive?: MessageInterface[],
	friends?: UserInterface[],
	blocked?: UserInterface[],
	chatMessages?: ChatMsgInterface[],
	roomOwner?: ChatRoomInterface[],
	roomAdmins?: ChatRoomInterface[],
	roomUsers?: ChatRoomInterface[],
	roomBannedUsers?: ChatRoomInterface[],
	roomMutedUsers?: ChatRoomInterface[]
}