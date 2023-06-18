import {
  BaseEntity,
  Column,
  Entity,
  // JoinColumn,
  // JoinTable,
  ManyToMany,
  // ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { UserRelationEntity } from 'src/modules/users_relations/entities/users_relation.entity';
import { ChatMessageEntity } from 'src/modules/chat/entity/chat.message.entity';
import { ChatRoomEntity } from 'src/modules/chat/entity/chat.room.entity';
import { GameEntity } from 'src/modules/game/entity/game.entity';
import { NotificationEntity } from 'src/modules/notification/entity/notification.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
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
    unique: true,
  })
  login: string;

  @Column({
    type: 'text',
    unique: true,
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
  status: 'online' | 'offline' | 'absent';

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

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActivity: Date;

  /* messagerie */
  @OneToMany(() => MessageEntity, (message) => message.ownerUser, {
    cascade: true,
  })
  messagesSend: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.destUser, {
    cascade: true,
  })
  messagesReceive: MessageEntity[];

  /* chat */
  @OneToMany(() => ChatMessageEntity, (message) => message.ownerUser, {
    cascade: true,
  })
  chatMessages: ChatMessageEntity[];

  //chat room
  // @ManyToMany(() => ChatRoomEntity, (room) => room.users, {
  //     cascade: true
  // })
  // rooms: ChatRoomEntity[];

  @OneToMany(() => ChatRoomEntity, (room) => room.ownerUser, {
    cascade: true,
  })
  roomOwner: ChatRoomEntity[];

  @ManyToMany(() => ChatRoomEntity, (room) => room.acceptedUsers, {
    cascade: true,
  })
  roomAccepted: ChatRoomEntity[];

  @ManyToMany(() => ChatRoomEntity, (room) => room.admins, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  roomAdmins: ChatRoomEntity[];

  @ManyToMany(() => ChatRoomEntity, (room) => room.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  roomUsers: ChatRoomEntity[];

  @ManyToMany(() => ChatRoomEntity, (room) => room.bannedUsers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  roomBannedUsers: ChatRoomEntity[];

  @ManyToMany(() => ChatRoomEntity, (room) => room.mutedUsers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  roomMutedUsers: ChatRoomEntity[];

  /*  Games  */
  @OneToMany(() => GameEntity, (game) => game.player1, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  gamesAsPlayer1: GameEntity[];

  @OneToMany(() => GameEntity, (game) => game.player2, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  gamesAsPlayer2: GameEntity[];

  @OneToMany(() => GameEntity, (game) => game.winner, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  wonGames: GameEntity[];

  /* users relations */
  @OneToMany(
    () => UserRelationEntity,
    (userRelation) => userRelation.userInitiateur,
  )
  initiatedRelations: UserRelationEntity[];

  @OneToMany(
    () => UserRelationEntity,
    (userRelation) => userRelation.userRelation,
  )
  relatedRelations: UserRelationEntity[];

  /* notifications */
  @OneToMany(() => NotificationEntity, (notif) => notif.sender, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  notificationsSend: NotificationEntity[];

  @OneToMany(() => NotificationEntity, (notif) => notif.receiver, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  notificationsReceived: NotificationEntity[];

  /* helper */
  get relations(): UserRelationEntity[] {
    return [...this.initiatedRelations, ...this.relatedRelations];
  }

  get friends(): UserEntity[] {
    return [...this.initiatedRelations, ...this.relatedRelations]
      .filter(
        (relation) =>
          relation.relationType === 'friend' &&
          relation.mutuelBlocked === false,
      )
      .map((relation) =>
        relation.userInitiateur.id === this.id
          ? relation.userRelation
          : relation.userInitiateur,
      );
  }

  get blocked(): UserEntity[] {
    return [...this.initiatedRelations, ...this.relatedRelations]
      .filter((relation) => relation.relationType === 'blocked')
      .map((relation) =>
        relation.userInitiateur.id === this.id
          ? relation.userRelation
          : relation.userInitiateur,
      );
  }
}
