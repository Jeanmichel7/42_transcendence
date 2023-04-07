import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { MessageInterface } from 'src/modules/messagerie/interfaces/messages.interface';

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

    @OneToMany(() => MessageEntity, message => message.ownerUser)
    messagesSend: MessageInterface[];

    @OneToMany(() => MessageEntity, message => message.destUser)
    messagesReceive: MessageInterface[];

}

