import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersRelationsService } from './users_relations.service';
import { UsersRelationsController } from './users_relations.controller';

import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';

import { UserRelationEntity } from './entities/users_relation.entity';
import { UserEntity } from '../users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRelationEntity])],
  providers: [UsersRelationsService, AuthOwner, AuthAdmin],
  controllers: [UsersRelationsController]
})
export class UsersRelationsModule {}
