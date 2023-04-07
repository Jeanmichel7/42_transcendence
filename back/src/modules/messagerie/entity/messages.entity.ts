import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/modules/users/entity/users.entity';

@Entity('messages')
export class MessageEntity extends BaseEntity {

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
	createdAt: string;

	@Column({
		nullable: true,
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt: string;

	@ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
	ownerUser: bigint;

	@ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
	destUser: bigint;

}