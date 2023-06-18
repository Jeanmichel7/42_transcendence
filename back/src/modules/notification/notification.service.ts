import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationEntity } from 'src/modules/notification/entity/notification.entity';
import { NotificationInterface } from './interfaces/notification.interface';
import { UserEntity } from '../users/entity/users.entity';
import { NotificationCreateDTO } from './dto/notification.create.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationCreatedEvent } from './events/notification.event';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findNotifsNotRead(userId: bigint): Promise<NotificationInterface[]> {
    // console.log('userId : ', userId);
    // const user: UserEntity = await UserEntity.findOne({
    //   where: { id: userId },
    //   // relations: ['notificationsReceived'],
    // });
    // if (!user) {
    //   throw new NotFoundException('User not found');
    // }

    const notifications: NotificationInterface[] =
      await this.notificationRepository
        .createQueryBuilder('notifications')
        .where('notifications.receiver = :userId', { userId })
        .andWhere('notifications.read = :read', { read: false })
        .leftJoin('notifications.sender', 'sender')
        .addSelect([
          'sender.id',
          'sender.login',
          'sender.firstName',
          'sender.lastName',
          'sender.avatar',
        ])
        .leftJoin('notifications.receiver', 'receiver')
        .addSelect([
          'receiver.id',
          'receiver.login',
          'receiver.firstName',
          'receiver.lastName',
          'receiver.avatar',
        ])
        .orderBy('notifications.createdAt', 'DESC')
        .getMany();
    console.log('notifications : ', notifications);

    return notifications;
  }

  async createNotification(
    newNotification: NotificationCreateDTO,
  ): Promise<NotificationEntity> {
    const savedNotification = await this.notificationRepository.save(
      newNotification,
    );
    console.log('savedNotification : ', savedNotification);

    this.eventEmitter.emit(
      'notification.' + savedNotification.type,
      new NotificationCreatedEvent(savedNotification),
    );

    // return test;
    return savedNotification;
  }

  async readNotification(
    userId: bigint,
    notificationId: bigint,
  ): Promise<NotificationInterface> {
    const notification: NotificationEntity =
      await this.notificationRepository.findOne({
        where: { id: notificationId },
        relations: ['receiver'],
      });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.receiver.id !== userId)
      throw new BadRequestException('Notification not for this user');

    notification.read = true;
    const savedNotification = await this.notificationRepository.save(
      notification,
    );
    return savedNotification;
  }
}
