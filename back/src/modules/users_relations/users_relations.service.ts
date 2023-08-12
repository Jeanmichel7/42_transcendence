import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { UserRelationEntity } from 'src/modules/users_relations/entities/users_relation.entity';
import { UserRelationInterface } from 'src/modules/users_relations/interfaces/users_relations.interface';
import { NotificationService } from '../notification/notification.service';
import { NotificationCreateDTO } from '../notification/dto/notification.create.dto';
import { NotificationEntity } from '../notification/entity/notification.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersRelationsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRelationEntity)
    private readonly userRelationRepository: Repository<UserRelationEntity>,
    private readonly notificationService: NotificationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // surement foireux ! et pas utilisé
  async getAllRelations(userId: bigint): Promise<UserRelationInterface[]> {
    const userRelations: UserRelationEntity[] =
      await this.userRelationRepository
        .createQueryBuilder('user_relation')
        .select([
          'user_relation.id',
          'user_relation.relationType',
          'user_relation.createdAt',
          'user_relation.updatedAt',
        ])
        .leftJoin('user_relation.userInitiateur', 'user')
        .addSelect([
          'user.id',
          'user.login',
          'user.email',
          'user.firstName',
          'user.lastName',
          'user.description',
          'user.avatar',
          'user.status',
        ])
        .leftJoin('user_relation.userRelation', 'userRelation')
        .addSelect([
          'userRelation.id',
          'userRelation.login',
          'userRelation.email',
          'userRelation.firstName',
          'userRelation.lastName',
          'userRelation.description',
          'userRelation.avatar',
          'userRelation.status',
        ])
        .where('user.id = :userId', { userId })
        .orWhere('userRelation.id = :userId', { userId })
        .getMany();
    return userRelations;
  }

  async getAllFriendsofUserByLogin(login: string): Promise<UserInterface[]> {
    const userRelations: UserRelationEntity[] =
      await this.userRelationRepository
        .createQueryBuilder('user_relation')
        .select('user_relation')
        .leftJoin('user_relation.userInitiateur', 'userInitiateur')
        .addSelect([
          'userInitiateur.id',
          'userInitiateur.login',
          'userInitiateur.email',
          'userInitiateur.firstName',
          'userInitiateur.lastName',
          'userInitiateur.description',
          'userInitiateur.avatar',
          'userInitiateur.status',
        ])
        .leftJoin('user_relation.userRelation', 'userRelation')
        .addSelect([
          'userRelation.id',
          'userRelation.login',
          'userRelation.email',
          'userRelation.firstName',
          'userRelation.lastName',
          'userRelation.description',
          'userRelation.avatar',
          'userRelation.status',
        ])
        .where('user_relation.relationType = :relationType', {
          relationType: 'friend',
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('userInitiateur.login = :login', { login }).orWhere(
              'userRelation.login = :login',
              { login },
            );
          }),
        )
        .getMany();

    if (userRelations.length === 0) return [];

    const allFriends: UserInterface[] = userRelations.map((relation) =>
      relation.userInitiateur.login == login
        ? relation.userRelation
        : relation.userInitiateur,
    );
    return allFriends;
  }

  async getAllFriendsOfUser(userId: bigint): Promise<UserInterface[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'login',
        'email',
        'firstName',
        'lastName',
        'description',
        'avatar',
        'status',
      ],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const allRelationFriends: UserRelationEntity[] =
      await this.userRelationRepository
        .createQueryBuilder('user_relation')
        .select([
          'user_relation.id',
          'user_relation.relationType',
          'user_relation.createdAt',
          'user_relation.updatedAt',
        ])
        .leftJoin('user_relation.userInitiateur', 'userInitiateur')
        .addSelect([
          'userInitiateur.id',
          'userInitiateur.login',
          'userInitiateur.email',
          'userInitiateur.firstName',
          'userInitiateur.lastName',
          'userInitiateur.description',
          'userInitiateur.avatar',
          'userInitiateur.status',
        ])
        .leftJoin('user_relation.userRelation', 'userRelation')
        .addSelect([
          'userRelation.id',
          'userRelation.login',
          'userRelation.email',
          'userRelation.firstName',
          'userRelation.lastName',
          'userRelation.description',
          'userRelation.avatar',
          'userRelation.status',
        ])
        .where('user_relation.relationType = :relationType', {
          relationType: 'friend',
        })
        .andWhere(
          new Brackets((qb) => {
            qb.where('userInitiateur.id = :userId', { userId }).orWhere(
              'userRelation.id = :userId',
              { userId },
            );
          }),
        )
        .getMany();
    // console.log('allRelationFriends : ', allRelationFriends);

    const allFriends: UserInterface[] = allRelationFriends.map((relation) =>
      relation.userInitiateur.id == userId
        ? relation.userRelation
        : relation.userInitiateur,
    );

    return allFriends;
  }

  async getAllBlockedUsers(userId: bigint): Promise<UserInterface[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'login',
        'email',
        'firstName',
        'lastName',
        'description',
        'avatar',
        'status',
      ],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const allRelationBlocked: UserRelationEntity[] =
      await this.userRelationRepository
        .createQueryBuilder('user_relation')
        .select([
          'user_relation.id',
          'user_relation.relationType',
          'user_relation.createdAt',
          'user_relation.updatedAt',
        ])
        .leftJoin('user_relation.userInitiateur', 'userInitiateur')
        .addSelect([
          'userInitiateur.id',
          'userInitiateur.login',
          'userInitiateur.email',
          'userInitiateur.firstName',
          'userInitiateur.lastName',
          'userInitiateur.description',
          'userInitiateur.avatar',
          'userInitiateur.status',
        ])
        .leftJoin('user_relation.userRelation', 'userRelation')
        .addSelect([
          'userRelation.id',
          'userRelation.login',
          'userRelation.email',
          'userRelation.firstName',
          'userRelation.lastName',
          'userRelation.description',
          'userRelation.avatar',
          'userRelation.status',
        ])
        .where('user_relation.relationType = :relationType', {
          relationType: 'blocked',
        })
        .andWhere('userInitiateur.id = :userId', { userId })
        .getMany();

    if (allRelationBlocked.length === 0) return [];

    const allBlocked: UserInterface[] = allRelationBlocked.map((relation) =>
      relation.userInitiateur.id == userId
        ? relation.userRelation
        : relation.userInitiateur,
    );

    return allBlocked;
  }

  async getAllRequestsPending(userId: bigint): Promise<UserInterface[]> {
    const userRelations: UserRelationEntity[] =
      await this.userRelationRepository.find({
        where: { userRelation: { id: userId }, relationType: 'pending' },
        relations: ['userInitiateur', 'userRelation'],
      });
    if (userRelations.length === 0) return [];
    const allRequestsWaiting: UserInterface[] = userRelations.map(
      (relation) => relation.userInitiateur,
    );
    return allRequestsWaiting;
  }

  async getAllRequestsSent(userId: bigint): Promise<UserInterface[]> {
    const userRelations: UserRelationEntity[] =
      await this.userRelationRepository.find({
        where: { userInitiateur: { id: userId }, relationType: 'pending' },
        relations: ['userRelation', 'userInitiateur'],
      });
    if (userRelations.length === 0) return [];
    const allRequestsSent: UserInterface[] = userRelations.map(
      (relation) => relation.userRelation,
    );
    return allRequestsSent;
  }

  // async requestAddFriend(
  //   userId: bigint,
  //   friendId: bigint,
  // ): Promise<UserRelationInterface> {
  //   console.log('In requestAddFriend function');
  //   try {
  //     console.log('Inside try block');
  //     return Promise.resolve({} as UserRelationInterface); // Temporary return a resolved promise
  //   } catch (e) {
  //     console.log('Caught an error');
  //     throw new InternalServerErrorException(e);
  //   }
  // }

  async requestAddFriend(
    userId: bigint,
    friendId: bigint,
  ): Promise<UserRelationInterface> {
    if (userId == friendId)
      throw new ConflictException(`You can't add yourself as friend`);

    // check users
    const userToUpdate: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
    });
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userFriend: UserEntity = await this.userRepository.findOne({
      where: { id: friendId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
    });
    if (!userFriend)
      throw new NotFoundException(`User friend with id ${friendId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: [
          { userInitiateur: { id: userId }, userRelation: { id: friendId } },
          { userInitiateur: { id: friendId }, userRelation: { id: userId } },
        ],
        select: ['id', 'relationType', 'mutuelBlocked'],
        relations: ['userInitiateur', 'userRelation'],
      });

    if (relationExist) {
      const otherUser =
        relationExist.userInitiateur.id == userId
          ? relationExist.userRelation
          : relationExist.userInitiateur;
      if (relationExist.relationType == 'friend')
        throw new ConflictException(
          `${otherUser.login} is already your friend`,
        );
      else if (relationExist.relationType == 'pending') {
        if (relationExist.userInitiateur.id == userId) {
          throw new ConflictException(
            `You already send a request to ${otherUser.login}`,
          );
        } else {
          // accept friend request
          // this.acceptFriendRequest(userId, friendId);
          throw new ConflictException(
            `${otherUser.login} already send a request to you, accept it`,
          );
        }
      } else if (relationExist.relationType == 'blocked') {
        if (relationExist.userInitiateur.id == userId)
          throw new ConflictException(
            `You can't send a request to ${otherUser.login}, you have to unblock him first`,
          );
        else
          throw new ConflictException(
            `You can't send a request to ${otherUser.login}, you are blocked`,
          );
      } else {
        throw new ConflictException(
          `relationExist type non gere... qu;est ce que tu fou ?`,
        );
      }
    } else {
      const newRelation: Partial<UserRelationEntity> = {
        userInitiateur: userToUpdate, // userInitiateur: { id: userId } as UserEntity,
        userRelation: userFriend,
      };
      try {
        const createdRelation: UserRelationEntity =
          await this.userRelationRepository.save(newRelation);

        // send notification to userFriend
        // const notification: NotificationCreateDTO = {
        //   type: 'friendRequest',
        //   content: `send you a friend request`,
        //   receiver: userFriend,
        //   sender: userToUpdate,
        // };

        const newNotif: NotificationEntity =
          await this.notificationService.createNotification({
            type: 'friendRequest',
            content: `send you a friend request`,
            receiver: userFriend,
            sender: userToUpdate,
          } as NotificationCreateDTO);
        if (!newNotif)
          throw new InternalServerErrorException(
            `Can't create notification for user ${userFriend.login}`,
          );

        return createdRelation;
      } catch (e) {
        throw new BadRequestException(
          `User ${userId} can't request ${friendId}`,
          e,
        );
      }
    }
  }

  async acceptFriendRequest(
    userId: bigint,
    friendId: bigint,
  ): Promise<UserRelationInterface> {
    if (userId == friendId)
      throw new ConflictException(`You can't add yourself as friend`);

    // check users
    const userToUpdate: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userFriend: UserEntity = await this.userRepository.findOne({
      where: { id: friendId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userFriend)
      throw new NotFoundException(`User friend with id ${friendId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: [
          { userInitiateur: { id: userId }, userRelation: { id: friendId } },
          { userInitiateur: { id: friendId }, userRelation: { id: userId } },
        ],
        select: ['id', 'relationType', 'mutuelBlocked'],
        relations: ['userInitiateur', 'userRelation'],
      });

    if (!relationExist) {
      throw new NotFoundException(
        `Relation between user ${userId} and user friend ${friendId} not found`,
      );
    }

    if (relationExist.relationType == 'friend')
      throw new ConflictException(`${userFriend.login} is already your friend`);
    else if (relationExist.relationType == 'pending') {
      if (relationExist.userInitiateur.id !== userId) {
        relationExist.relationType = 'friend';
        relationExist.updatedAt = new Date();
        try {
          const updatedRelation: UserRelationEntity =
            await this.userRelationRepository.save(relationExist);

          // send notification to userFriend
          // this.eventEmitter.emit(
          //   'notification.' + savedNotification.type,
          //   new NotificationCreatedEvent(savedNotification),
          // );

          const newNotif: NotificationEntity =
            await this.notificationService.sendNotification({
              type: 'friendRequestAccepted',
              content: `accepted your friend request`,
              receiver: userFriend,
              sender: userToUpdate,
            } as NotificationCreateDTO);
          if (!newNotif)
            throw new InternalServerErrorException(
              `Can't create notification for user ${userFriend.login}`,
            );

          return updatedRelation;
        } catch (e) {
          throw new BadRequestException(
            `User ${userId} can't accept ${friendId}`,
            e,
          );
        }
      } else {
        throw new ConflictException(
          `You didn't send a request to ${userFriend.login}`,
        );
      }
    } else if (relationExist.relationType == 'blocked') {
      if (relationExist.userInitiateur.id == userId)
        throw new ConflictException(
          `You can't accept ${userFriend.login}, you have to unblock him first`,
        );
      else
        throw new ConflictException(
          `You can't accept ${userFriend.login}, you are blocked`,
        );
    } else {
      console.error('relationExist type non gere... qu;est ce que tu fou ?');
    }
  }

  async declineFriendRequest(userId: bigint, friendId: bigint): Promise<void> {
    if (userId == friendId)
      throw new ConflictException(`You can't decline yourself`);

    // check users
    const userToUpdate: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userFriend: UserEntity = await this.userRepository.findOne({
      where: { id: friendId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userFriend)
      throw new NotFoundException(`User friend with id ${friendId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: [
          { userInitiateur: { id: userId }, userRelation: { id: friendId } },
          { userInitiateur: { id: friendId }, userRelation: { id: userId } },
        ],
        select: ['id', 'relationType', 'mutuelBlocked'],
        relations: ['userInitiateur', 'userRelation'],
      });

    if (!relationExist) {
      throw new NotFoundException(
        `Relation between user ${userId} and user friend ${friendId} not found`,
      );
    }

    if (relationExist.relationType == 'pending') {
      if (relationExist.userInitiateur.id !== userId) {
        try {
          await this.userRelationRepository.delete({
            id: relationExist.id,
          });

          // send notification to userFriend
          const newNotif: NotificationEntity =
            await this.notificationService.sendNotification({
              type: 'friendRequestDeclined',
              content: `declined your friend request`,
              receiver: userFriend,
              sender: userToUpdate,
            } as NotificationCreateDTO);
          if (!newNotif)
            throw new InternalServerErrorException(
              `Can't create notification for user ${userFriend.login}`,
            );
        } catch (e) {
          throw new BadRequestException(
            `User ${userId} can't decline ${friendId}`,
            e,
          );
        }
      } else {
        throw new ConflictException(
          `You didn't send a request to ${userFriend.login}`,
        );
      }
    } else {
      throw new ConflictException(
        `You can't decline ${userFriend.login}, you are not friend`,
      );
    }
  }

  async cancelFriendRequest(userId: bigint, friendId: bigint): Promise<void> {
    if (userId == friendId)
      throw new ConflictException(`You can't decline yourself`);

    // check users
    const userToUpdate: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userFriend: UserEntity = await this.userRepository.findOne({
      where: { id: friendId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userFriend)
      throw new NotFoundException(`User friend with id ${friendId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: [
          { userInitiateur: { id: userId }, userRelation: { id: friendId } },
          { userInitiateur: { id: friendId }, userRelation: { id: userId } },
        ],
        select: ['id', 'relationType', 'mutuelBlocked'],
        relations: ['userInitiateur', 'userRelation'],
      });

    if (!relationExist) {
      throw new NotFoundException(
        `Relation between user ${userId} and user friend ${friendId} not found`,
      );
    }

    if (relationExist.relationType == 'pending') {
      // console.log('relationExist : ', relationExist.userInitiateur.id);
      // console.log('userId : ', userId);
      if (relationExist.userInitiateur.id == userId) {
        try {
          await this.userRelationRepository.delete({
            id: relationExist.id,
          });

          // send notification to userFriend
          const newNotif: NotificationEntity =
            await this.notificationService.sendNotification({
              type: 'friendRequestCanceled',
              content: `Canceled your friend request`,
              receiver: userFriend,
              sender: userToUpdate,
            } as NotificationCreateDTO);
          if (!newNotif)
            throw new InternalServerErrorException(
              `Can't create notification for user ${userFriend.login}`,
            );
        } catch (e) {
          throw new BadRequestException(
            `User ${userId} can't cancel ${friendId}`,
            e,
          );
        }
      } else {
        throw new ConflictException(
          `You didn't send a request to ${userFriend.login}`,
        );
      }
    } else {
      throw new ConflictException(
        `You can't cancel ${userFriend.login}, you are not friend`,
      );
    }
  }

  async blockUser(
    userId: bigint,
    blockedId: bigint,
  ): Promise<UserRelationInterface> {
    if (userId == blockedId)
      throw new ConflictException(`You can't block yourself`);

    // check users
    const userToUpdate: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });

    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userBlocked: UserEntity = await this.userRepository.findOne({
      where: { id: blockedId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });

    if (!userBlocked)
      throw new NotFoundException(`User friend with id ${blockedId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: [
          { userInitiateur: { id: userId }, userRelation: { id: blockedId } },
          { userInitiateur: { id: blockedId }, userRelation: { id: userId } },
        ],
        select: ['id', 'relationType', 'mutuelBlocked'],
        relations: ['userInitiateur', 'userRelation'],
      });

    if (relationExist) {
      const otherUser =
        relationExist.userInitiateur.id == userId
          ? relationExist.userRelation
          : relationExist.userInitiateur;
      if (relationExist.relationType == 'friend') {
        relationExist.relationType = 'blocked';
        relationExist.userInitiateur = userToUpdate;
        relationExist.userRelation = userBlocked;
        relationExist.updatedAt = new Date();
        try {
          const updatedRelation: UserRelationEntity =
            await this.userRelationRepository.save(relationExist);

          // send notification to userFriend
          const newNotif: NotificationEntity =
            await this.notificationService.sendNotification({
              type: 'blockUser',
              content: `blocked you`,
              receiver: userBlocked,
              sender: userToUpdate,
            } as NotificationCreateDTO);
          if (!newNotif)
            throw new InternalServerErrorException(
              `Can't create notification for user ${userBlocked.login}`,
            );

          return updatedRelation;
        } catch (e) {
          throw new BadRequestException(
            `User ${userId} can't block ${blockedId}`,
            e,
          );
        }
      } else if (relationExist.relationType == 'pending') {
        if (relationExist.userInitiateur.id == userId)
          throw new ConflictException(
            `You already send a request to ${otherUser.login}`,
          );
        else
          throw new ConflictException(
            `You can't send a request to ${otherUser.login}, you are blocked`,
          );
      } else if (relationExist.relationType == 'blocked') {
        if (relationExist.userInitiateur.id == userId)
          throw new ConflictException(`You already block ${otherUser.login}`);
        else {
          relationExist.mutuelBlocked = true;
          relationExist.updatedAt = new Date();
          try {
            const updatedRelation: UserRelationEntity =
              await this.userRelationRepository.save(relationExist);

            // send notification to userFriend
            const newNotif: NotificationEntity =
              await this.notificationService.sendNotification({
                type: 'blockUser',
                content: `blocked you`,
                receiver: userBlocked,
                sender: userToUpdate,
              } as NotificationCreateDTO);
            if (!newNotif)
              throw new InternalServerErrorException(
                `Can't create notification for user ${userBlocked.login}`,
              );

            return updatedRelation;
          } catch (e) {
            throw new BadRequestException(
              `User ${userId} can't block ${blockedId}`,
              e,
            );
          }
        }
      } else {
        console.error('relationExist type non gere... qu;est ce que tu fou ?');
      }
    } else {
      const newRelation: Partial<UserRelationEntity> = {
        userInitiateur: userToUpdate,
        userRelation: userBlocked,
        relationType: 'blocked',
      };
      try {
        const createdRelation: UserRelationEntity =
          await this.userRelationRepository.save(newRelation);
        return createdRelation;
      } catch (e) {
        throw new BadRequestException(
          `User ${userId} can't block ${blockedId}`,
          e,
        );
      }
    }
  }

  async unblockUser(userId: bigint, blockedId: bigint): Promise<void> {
    if (userId == blockedId)
      throw new ConflictException(`You can't unblock yourself`);

    // check users
    const userToUpdate: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userBlocked: UserEntity = await this.userRepository.findOne({
      where: { id: blockedId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userBlocked)
      throw new NotFoundException(`User friend with id ${blockedId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: [
          { userInitiateur: { id: userId }, userRelation: { id: blockedId } },
          { userInitiateur: { id: blockedId }, userRelation: { id: userId } },
        ],
        select: ['id', 'relationType', 'mutuelBlocked'],
        relations: ['userInitiateur', 'userRelation'],
      });

    if (!relationExist) {
      throw new NotFoundException(
        `Relation between user ${userId} and user friend ${blockedId} not found`,
      );
    }

    if (relationExist.relationType == 'friend')
      throw new ConflictException(
        `${userBlocked.login} is your friend, you can't unblock him`,
      );
    else if (relationExist.relationType == 'pending') {
      if (relationExist.userInitiateur.id !== userId) {
        throw new ConflictException(
          `You didn't send a request to ${userBlocked.login}`,
        );
      } else {
        throw new ConflictException(
          `You can't unblock ${userBlocked.login}, you have to cancel your request first`,
        );
      }
    } else if (relationExist.relationType == 'blocked') {
      if (relationExist.userInitiateur.id == userId) {
        // relationExist.relationType = 'unblocked';
        // relationExist.mutuelBlocked = false;
        // relationExist.updatedAt = new Date();
        // try {
        //   const updatedRelation: UserRelationEntity =
        //     await this.userRelationRepository.save(relationExist);

        //   return updatedRelation;
        // } catch (e) {
        //   throw new InternalServerErrorException(
        //     `User ${userId} can't unblock ${blockedId}`,
        //     e,
        //   );
        // }

        //delete relation
        try {
          const result = await this.userRelationRepository.delete({
            id: relationExist.id,
          });
          if (result.affected === 0) {
            throw new InternalServerErrorException(
              `Error while deleting relation between user ${userId} and user friend ${blockedId}`,
            );
          }

          // send notification to userFriend
          const newNotif: NotificationEntity =
            await this.notificationService.sendNotification({
              type: 'unblockUser',
              content: `unblocked you`,
              receiver: userBlocked,
              sender: userToUpdate,
            } as NotificationCreateDTO);
          if (!newNotif)
            throw new InternalServerErrorException(
              `Can't create notification for user ${userBlocked.login}`,
            );
        } catch (e) {
          throw new InternalServerErrorException(
            `Error while deleting relation between user ${userId} and user friend ${blockedId}`,
            e,
          );
        }
      } else {
        throw new ConflictException(
          `You can't unblock ${userBlocked.login}, you are blocked`,
        );
      }
    } else {
      console.error('relationExist type non gere... qu;est ce que tu fou ?');
    }
  }

  async deleteRelation(userId: bigint, friendId: bigint): Promise<void> {
    if (userId == friendId)
      throw new ConflictException(`You can't delete yourself`);

    // check users
    const userToUpdate: UserEntity = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userFriend: UserEntity = await this.userRepository.findOne({
      where: { id: friendId },
      select: ['id', 'login', 'firstName', 'lastName', 'avatar', 'status'],
      relations: ['initiatedRelations', 'relatedRelations'],
    });
    if (!userFriend)
      throw new NotFoundException(`User friend with id ${friendId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: [
          { userInitiateur: { id: userId }, userRelation: { id: friendId } },
          { userInitiateur: { id: friendId }, userRelation: { id: userId } },
        ],
        select: ['id', 'relationType', 'mutuelBlocked'],
        relations: ['userInitiateur', 'userRelation'],
      });

    if (!relationExist) {
      throw new NotFoundException(
        `Relation between user ${userId} and user friend ${friendId} not found`,
      );
    }

    const result = await this.userRelationRepository.delete({
      id: relationExist.id,
    });
    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Error while deleting relation between user ${userId} and user friend ${friendId}`,
      );
    }

    // send notification to userFriend
    const newNotif: NotificationEntity =
      await this.notificationService.sendNotification({
        type: 'friendDeleted',
        content: `deleted you from his friend list`,
        receiver: userFriend,
        sender: userToUpdate,
      } as NotificationCreateDTO);
    if (!newNotif)
      throw new InternalServerErrorException(
        `Can't create notification for user ${userFriend.login}`,
      );
  }
}
