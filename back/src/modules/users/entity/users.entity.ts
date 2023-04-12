import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { UserRelationEntity } from 'src/modules/users_relations/entities/users_relation.entity';
import { ChatMessageEntity } from 'src/modules/chat/entity/chat.message.entity';
import { ChatRoomEntity } from 'src/modules/chat/entity/chat.room.entity';

@Entity('users')
export class UserEntity extends BaseEntity{

    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: bigint;

    @Column({
        type: 'text',
    })
    firstName: string;

    @Column({
        type: 'text',
    })
    lastName: string;

    @Column({
        type: 'text',
        unique: true
    })
    login: string;

    @Column({
        type: 'text',
        unique: true
    })
    email: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    password: string;

    @Column({
        type: 'text',
        default: 'user',
    })
    role: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    avatar: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'boolean',
        default: false,
        nullable: true,
    })
    is2FAEnabled: boolean;

    @Column({
        type: 'text',
        default: 'offline',
        nullable: true,
    })
    status: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    secret2FA: string;

    @Column({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@Column({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date;

    // messagerie
    @OneToMany(() => MessageEntity, message => message.ownerUser, { cascade: true })
    messagesSend: MessageEntity[];

    @OneToMany(() => MessageEntity, message => message.destUser, { cascade: true })
    messagesReceive: MessageEntity[];

    @OneToMany(() => UserRelationEntity, (userRelation) => userRelation.userRelation)
    friends: UserEntity[];

    @OneToMany(() => UserRelationEntity, (userRelation) => userRelation.userRelation)
    blocked: UserEntity[];

    // chat  messages
    @OneToMany(() => ChatMessageEntity, (message) => message.user, {
        cascade: true
    })
    chatMessages: ChatMessageEntity[];


    //chat room
    // @ManyToMany(() => ChatRoomEntity, (room) => room.users, {
    //     cascade: true
    // })
    // rooms: ChatRoomEntity[];

    @OneToMany(() => ChatRoomEntity, (room) => room.ownerUser, {
        cascade: true
    })
    roomOwner: ChatRoomEntity[];




    @ManyToMany(() => ChatRoomEntity, (room) => room.admins, {
        cascade: true
    })
    roomAdmins: ChatRoomEntity[];

    @ManyToMany(() => ChatRoomEntity, (room) => room.users, {
        cascade: true
    })
    roomUsers: ChatRoomEntity[];

    @ManyToMany(() => ChatRoomEntity, (room) => room.bannedUsers, {
        cascade: true
    })
    roomBannedUser: ChatRoomEntity[];

    @ManyToMany(() => ChatRoomEntity, (room) => room.mutedUsers, {
        cascade: true
    })
    roomMutedUsers: ChatRoomEntity[];

}

