import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/users/entity/users.entity';
import { ChatRoomEntity } from './chat.room.entity';

@Entity('chat_messages')
export class ChatMessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: bigint;

  @Column({
    type: 'text',
  })
  text: string;

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

  @ManyToOne(() => UserEntity, (user) => user.chatMessages, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => ChatRoomEntity, (room) => room.messages, {
    onDelete: 'CASCADE',
  })
  room: ChatRoomEntity;
}
