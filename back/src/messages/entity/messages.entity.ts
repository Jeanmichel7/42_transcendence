import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserInfo } from 'src/typeorm';

@Entity('messages')
export class MessageInfo extends BaseEntity{

    @PrimaryGeneratedColumn({
        type: 'bigint',
    })
    id: bigint;

    // @Column({
    //     nullable: true,
    //     type: 'bigint',
    // })
    // ownerUserId: number;

    // @Column({
    //     nullable: true,
    //     type: 'bigint',
    // })
    // destUserId: number;

    @Column({
        type: 'text',
    })
    data: string;

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

    @ManyToOne(() => UserInfo, user => user.id)
    ownerUser: bigint;

    @ManyToOne(() => UserInfo, user => user.id)
    destUser: bigint;

}