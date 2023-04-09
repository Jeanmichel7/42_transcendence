import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';

import { UserEntity } from './entity/users.entity';
// import { UserRelationEntity } from './entity/user.relation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]) ],
  providers: [UsersService, AuthOwner, AuthAdmin],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
