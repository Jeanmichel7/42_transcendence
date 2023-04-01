import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MessageInfo } from 'src/typeorm';

@Entity('users')
export class UserInfo extends BaseEntity{

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
        // nullable: true,
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
    is_2fa: boolean;

    @OneToMany(() => MessageInfo, message => message.ownerUser)
    messagesSend: MessageInfo[];

    @OneToMany(() => MessageInfo, message => message.destUser)
    messagesReceive: MessageInfo[];

}

