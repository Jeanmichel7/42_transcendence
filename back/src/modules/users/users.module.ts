import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';
import { UserEntity } from './entity/users.entity';
import { multerConfig } from 'config/multer.config';
import { JwtService } from '@nestjs/jwt';
import { TrophiesEntity } from '../trophies/entity/trophies.entity';
import { UserTrophiesEntity } from '../trophies/entity/userTrophiesProgress.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/entity/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TrophiesEntity,
      UserTrophiesEntity,
      NotificationEntity,
    ]),
    MulterModule.register(multerConfig),
  ],
  providers: [UsersService, AuthAdmin, JwtService, NotificationService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
