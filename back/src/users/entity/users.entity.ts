import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserInfo extends BaseEntity{

    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: number;

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
    })
    pseudo: string;

    @Column({
        type: 'text',
    })
    email: string;

    @Column({
        type: 'text',
    })
    password: string;

    @Column({
        type: 'boolean',
        default: false,
        nullable: true,
    })
    is_admin: boolean;

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
}

