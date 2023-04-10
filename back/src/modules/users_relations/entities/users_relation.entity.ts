import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { UserEntity } from 'src/modules/users/entity/users.entity'
import { timestamp } from 'rxjs';

@Entity("users_relation")
export class UserRelationEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: bigint;

    @Column({
      type: 'text',
      nullable: true,
    })
    relationType: string;

    @Column({
      nullable: true,
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date
  
    @Column({
      nullable: true,
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date

    @ManyToOne(() => UserEntity, (user) => user)
    user: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.friends)
    userRelation: UserEntity;

    // @ManyToOne(() => UserEntity, (user) => user.blocked)
    // userBlocked: UserEntity;
}


