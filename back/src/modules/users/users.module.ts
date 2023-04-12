import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';

import { UserEntity } from './entity/users.entity';
import { multerConfig } from 'src/config/multer.config';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.register(multerConfig),
    // MulterModule.register({
    //   dest: 'uploads/users_avatars',
    // }),
  ],
  providers: [UsersService, AuthOwner, AuthAdmin],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
