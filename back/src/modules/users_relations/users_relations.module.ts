import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersRelationsService } from './users_relations.service';
import { UsersRelationsController } from './users_relations.controller';

// import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';

import { UserRelationEntity } from './entities/users_relation.entity';
import { UserEntity } from '../users/entity/users.entity';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/entity/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserRelationEntity,
      NotificationEntity,
    ]),
  ],
  providers: [
    UsersRelationsService,
    AuthAdmin,
    JwtService,
    NotificationService,
  ],
  controllers: [UsersRelationsController],
})
export class UsersRelationsModule {}
