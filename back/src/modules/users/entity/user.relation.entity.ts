import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { UserEntity } from './users.entity';

@Entity()
export class UserRelationEntity{

    @PrimaryGeneratedColumn()
    id: bigint;

    @Column()
    relationType: string;

    @ManyToOne(() => UserEntity, user => user)
    user1: UserEntity;

    @ManyToOne(() => UserEntity, user => user.friends)
    user2: UserEntity;


    // @ManyToMany(() => UserEntity, user => user.blocked)
    // blocked: UserEntity[];

}

