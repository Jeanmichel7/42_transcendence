import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'src/modules/users/entity/users.entity';

@Entity('users_relation')
export class UserRelationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: bigint;

  @Column({
    type: 'text',
    default: 'pending',
  })
  relationType: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  mutuelBlocked: boolean;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.initiatedRelations, {
    onDelete: 'CASCADE',
  })
  userInitiateur: UserEntity;

  @ManyToOne(() => UserEntity, user => user.relatedRelations, {
    onDelete: 'CASCADE',
  })
  userRelation: UserEntity;
}
