import { AfterInsert, BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/modules/users/entity/users.entity';
import { ChatMessageEntity } from './chat.message.entity';

@Entity('chat-rooms')
export class ChatRoomEntity extends BaseEntity {

	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: bigint;

	@Column({
		type: 'text',
		default: 'public',
	})
	status: string;

	// @Column({
	// 	type: 'text',
	// 	nullable: true,
	// 	default: 'room',
	// })
	// name: string;

	@Column({
		type: 'text',
		nullable: true,
	})
	password: string;

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

	// relation chat message
	@OneToMany(() => ChatMessageEntity, message => message.room, {
		 onDelete: 'CASCADE',
		//  cascade: true,
	})
	messages: ChatMessageEntity[];

	// relation user
	@ManyToOne(() => UserEntity, user => user.roomOwner)
	@JoinColumn()
	ownerUser: UserEntity;

	@ManyToMany(() => UserEntity, (user) => user.roomUsers)
	@JoinTable()
	users: UserEntity[];

	@ManyToMany(() => UserEntity, (user) => user.roomAdmins)
	@JoinTable()
  admins: UserEntity[];

	@ManyToMany(() => UserEntity, (user) => user.roomBannedUser)
	@JoinTable()
	bannedUsers: UserEntity[];

	@ManyToMany(() => UserEntity, (user) => user.roomMutedUsers)
	@JoinTable()
	mutedUsers: UserEntity[];
}