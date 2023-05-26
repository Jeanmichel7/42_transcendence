import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/users/entity/users.entity';
import { ChatMessageEntity } from './chat.message.entity';

@Entity('chat_rooms')
export class ChatRoomEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: bigint;

  @Column({
    type: 'text',
    default: 'public',
  })
  type: 'public' | 'protected';

  @Column({
    type: 'text',
    default: 'room',
  })
  name: string;

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
  @OneToMany(() => ChatMessageEntity, (message) => message.room, {
    onDelete: 'CASCADE',
    //  cascade: true,
  })
  messages: ChatMessageEntity[];

  // relation user
  @ManyToOne(() => UserEntity, (user) => user.roomOwner, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  ownerUser: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.roomUsers, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  users: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roomAdmins, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  admins: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roomBannedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  bannedUsers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roomMutedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  mutedUsers: UserEntity[];
}
