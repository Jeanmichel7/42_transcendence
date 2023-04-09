import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';

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

    @OneToMany(() => MessageEntity, message => message.ownerUser, { cascade: true })
    messagesSend: MessageEntity[];

    @OneToMany(() => MessageEntity, message => message.destUser, { cascade: true })
    messagesReceive: MessageEntity[];
}

