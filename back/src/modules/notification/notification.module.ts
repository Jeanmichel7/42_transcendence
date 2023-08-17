import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entity/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './gateway/notification.gateway';
import { NotificationListener } from './events/notification.listener';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity])],
  providers: [
    NotificationService,
    AuthAdmin,
    NotificationGateway,
    NotificationListener,
    JwtService,
  ],
  controllers: [NotificationController],
  exports: [NotificationGateway],
})
export class NotificationModule {}
