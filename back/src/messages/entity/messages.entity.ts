import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserInfo } from 'src/typeorm';

@Entity('messages')
export class MessageInfo extends BaseEntity{

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
    createAt: string;

    @Column({
        nullable: true,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updateAt: string;

    @ManyToOne(() => UserInfo, user => user.id, {onDelete: 'CASCADE'})
    ownerUser: bigint;

    @ManyToOne(() => UserInfo, user => user.id, {onDelete: 'CASCADE'})
    destUser: bigint;

}