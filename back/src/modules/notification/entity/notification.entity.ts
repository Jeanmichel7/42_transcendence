import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'config';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: bigint;

  @Column({
    type: 'text',
  })
  type:
    | 'friendRequest'
    | 'friendRequestAccepted'
    | 'friendRequestDeclined'
    | 'friendRequestCanceled'
    | 'friendDeleted'
    | 'blockUser'
    | 'unblockUser'
    | 'roomInvite'
    | 'gameInvite'
    | 'gameInviteAccepted'
    | 'gameInviteDeclined'
    | 'message'
    | 'trophy';

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  read: boolean;

  @Column({
    nullable: true,
    type: 'text',
  })
  invitationLink: string;

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

  @ManyToOne(() => UserEntity, user => user.notificationsSend, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  sender: UserEntity;

  @ManyToOne(() => UserEntity, user => user.notificationsReceived, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  receiver: UserEntity;
}
