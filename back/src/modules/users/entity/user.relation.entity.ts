import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { UserEntity } from './users.entity';

@Entity("users_relation")
export class UserRelationEntity{

    @PrimaryGeneratedColumn()
    id: bigint;

    @Column({
      type: 'bigint',
    })
    userId: bigint;

    @Column()
    relationType: string;

    @Column({
      nullable: true,
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: string;
  
    @Column({
      nullable: true,
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: string;

    @ManyToOne(() => UserEntity, (user) => user.friends)
    userFriend: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.blocked)
    userBlocked: UserEntity;
}

