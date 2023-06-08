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

@Injectable()
export class UsersRelationsService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRelationEntity)
    private readonly userRelationRepository: Repository<UserRelationEntity>,
  ) {}

  // surement foireux !
  async getAllRelations(userId: bigint): Promise<UserRelationInterface[]> {
    const userRelations: UserRelationEntity[] =
      await this.userRelationRepository
        .createQueryBuilder('user-relation')
        .select([
          'user-relation.id',
          'user-relation.relationType',
          'user-relation.createdAt',
          'user-relation.updatedAt',
        ])
        .leftJoin('user-relation.userInitiateur', 'user')
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
        .leftJoin('user-relation.userRelation', 'userRelation')
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
        .createQueryBuilder('user-relation')
        .select('user-relation')
        .leftJoinAndSelect('user-relation.userInitiateur', 'userInitiateur')
        .leftJoinAndSelect('user-relation.userRelation', 'userRelation')
        .where('user-relation.relationType = :relationType', {
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
        .createQueryBuilder('user-relation')
        .select([
          'user-relation.id',
          'user-relation.relationType',
          'user-relation.createdAt',
          'user-relation.updatedAt',
        ])
        .leftJoinAndSelect('user-relation.userInitiateur', 'userInitiateur')
        .leftJoinAndSelect('user-relation.userRelation', 'userRelation')
        .where('user-relation.relationType = :relationType', {
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
    console.log('allRelationFriends : ', allRelationFriends);

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
        .createQueryBuilder('user-relation')
        .select([
          'user-relation.id',
          'user-relation.relationType',
          'user-relation.createdAt',
          'user-relation.updatedAt',
        ])
        .leftJoinAndSelect('user-relation.userInitiateur', 'userInitiateur')
        .leftJoinAndSelect('user-relation.userRelation', 'userRelation')
        .where('user-relation.relationType = :relationType', {
          relationType: 'blocked',
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

  // async getAllFriendsOfUser(userId: bigint): Promise<UserInterface[]> {
  //   const userRelations: UserRelationEntity[] =
  //     await this.userRelationRepository.find({
  //       where: { user: { id: userId }, relationType: 'friend' },
  //       relations: ['userRelation'],
  //     });
  //   const allFriends: UserInterface[] = userRelations.map((relation) => {
  //     return {
  //       id: relation.userRelation.id,
  //       firstName: relation.userRelation.firstName,
  //       lastName: relation.userRelation.lastName,
  //       login: relation.userRelation.login,
  //       email: relation.userRelation.email,
  //       description: relation.userRelation.description,
  //       avatar: relation.userRelation.avatar,
  //       status: relation.userRelation.status,
  //     };
  //   });
  //   return allFriends;
  // }

  // async getAllBlockedUsers(userId: bigint): Promise<UserInterface[]> {
  //   const userRelations: UserRelationEntity[] =
  //     await this.userRelationRepository.find({
  //       where: { user: { id: userId }, relationType: 'blocked' },
  //       relations: ['userRelation'],
  //     });
  //   const allBlockedUsers: UserInterface[] = userRelations.map((relation) => {
  //     return {
  //       id: relation.userRelation.id,
  //       firstName: relation.userRelation.firstName,
  //       lastName: relation.userRelation.lastName,
  //       login: relation.userRelation.login,
  //       email: relation.userRelation.email,
  //       description: relation.userRelation.description,
  //       avatar: relation.userRelation.avatar,
  //       status: relation.userRelation.status,
  //     };
  //   });
  //   return allBlockedUsers;
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
    });
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userFriend: UserEntity = await this.userRepository.findOne({
      where: { id: friendId },
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
        if (relationExist.userInitiateur.id == userId)
          throw new ConflictException(
            `You already send a request to ${otherUser.login}`,
          );
        else {
        } // accept friend request
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
        console.log('relationExist type non gere... qu;est ce que tu fou ?');
      }
    } else {
      const newRelation: Partial<UserRelationEntity> = {
        userInitiateur: userToUpdate, // userInitiateur: { id: userId } as UserEntity,
        userRelation: userFriend,
      };
      try {
        const createdRelation: UserRelationEntity =
          await this.userRelationRepository.save(newRelation);
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
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userFriend: UserEntity = await this.userRepository.findOne({
      where: { id: friendId },
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
      console.log('relationExist type non gere... qu;est ce que tu fou ?');
    }
  }

  // async addFriend(
  //   userId: bigint,
  //   friendId: bigint,
  // ): Promise<UserRelationInterface> {
  //   if (userId == friendId)
  //     throw new ConflictException(`You can't add yourself as friend`);

  //   const userToUpdate: UserEntity = await this.userRepository.findOne({
  //     where: { id: userId },
  //     select: [
  //       'id',
  //       'login',
  //       'email',
  //       'firstName',
  //       'lastName',
  //       'description',
  //       'avatar',
  //       'status',
  //     ],
  //   });
  //   if (!userToUpdate)
  //     throw new NotFoundException(`User with id ${userId} not found`);

  //   const userFriend: UserEntity = await this.userRepository.findOne({
  //     where: { id: friendId },
  //     select: [
  //       'id',
  //       'login',
  //       'email',
  //       'firstName',
  //       'lastName',
  //       'description',
  //       'avatar',
  //       'status',
  //     ],
  //   });
  //   if (!userFriend)
  //     throw new NotFoundException(`User friend with id ${friendId} not found`);

  //   // check if relation already exist
  //   const relationExist: UserRelationEntity =
  //     await this.userRelationRepository.findOne({
  //       where: { user: { id: userId }, userRelation: { id: friendId } },
  //       select: ['id', 'relationType'],
  //     });
  //   console.log(relationExist);
  //   if (relationExist?.relationType == 'friend')
  //     throw new ConflictException(`${userFriend.login} is already your friend`);

  //   const updateRelation: Partial<UserRelationEntity> = {
  //     ...relationExist,
  //     relationType: 'friend',
  //     user: userToUpdate,
  //     userRelation: userFriend,
  //     updatedAt: new Date(),
  //   };

  //   try {
  //     let newRelation: UserRelationEntity;
  //     if (relationExist?.relationType === 'blocked') {
  //       await this.userRelationRepository.update(
  //         { user: { id: userId }, userRelation: { id: friendId } },
  //         updateRelation,
  //       );
  //       newRelation = await this.userRelationRepository
  //         .createQueryBuilder('user_relation')
  //         .select([
  //           'user_relation.id',
  //           'user_relation.relationType',
  //           'user_relation.createdAt',
  //           'user_relation.updatedAt',
  //         ])
  //         .leftJoin('user_relation.user', 'user')
  //         .addSelect([
  //           'user.id',
  //           'user.login',
  //           'user.email',
  //           'user.firstName',
  //           'user.lastName',
  //           'user.description',
  //           'user.avatar',
  //           'user.status',
  //         ])
  //         .leftJoin('user_relation.userRelation', 'userRelation')
  //         .addSelect([
  //           'userRelation.id',
  //           'userRelation.login',
  //           'userRelation.email',
  //           'userRelation.firstName',
  //           'userRelation.lastName',
  //           'userRelation.description',
  //           'userRelation.avatar',
  //           'userRelation.status',
  //         ])
  //         .where('user.id = :userId', { userId })
  //         .andWhere('userRelation.id = :friendId', { friendId })
  //         .getOne();
  //     } else
  //       newRelation = await this.userRelationRepository.save(updateRelation);
  //     return newRelation;
  //   } catch (e) {
  //     throw new BadRequestException(
  //       `User ${userId} can't block ${friendId}`,
  //       e,
  //     );
  //   }
  // }

  async deleteRelation(userId: bigint, friendId: bigint): Promise<void> {
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
  }

  // async deleteRelation(userId: bigint, friendId: bigint): Promise<boolean> {
  //   if (userId === friendId)
  //     throw new BadRequestException(
  //       `User ${userId} can't delete himself as friend`,
  //     );

  //   const userToUpdate: UserEntity = await this.userRepository.findOne({
  //     where: { id: userId },
  //     select: [
  //       'id',
  //       'login',
  //       'email',
  //       'firstName',
  //       'lastName',
  //       'description',
  //       'avatar',
  //       'status',
  //     ],
  //   });
  //   if (!userToUpdate)
  //     throw new NotFoundException(`User with id ${userId} not found`);

  //   const userFriend: UserEntity = await this.userRepository.findOne({
  //     where: { id: friendId },
  //     select: [
  //       'id',
  //       'login',
  //       'email',
  //       'firstName',
  //       'lastName',
  //       'description',
  //       'avatar',
  //       'status',
  //     ],
  //   });
  //   if (!userFriend)
  //     throw new NotFoundException(`User friend with id ${friendId} not found`);

  //   // check if relation already exist
  //   const relationExist: UserRelationEntity[] =
  //     await this.userRelationRepository.find({
  //       where: {
  //         user: { id: userId },
  //         relationType: 'friend',
  //         userRelation: { id: friendId },
  //       },
  //       select: ['id'],
  //     });
  //   if (relationExist?.length === 0)
  //     throw new BadRequestException(
  //       `User ${userId} don't have ${friendId} as friend`,
  //     );

  //   // delete relation in users_relation table
  //   const relationToDelete: UserRelationEntity =
  //     await this.userRelationRepository.findOne({
  //       where: {
  //         user: { id: userId },
  //         relationType: 'friend',
  //         userRelation: { id: friendId },
  //       },
  //       select: ['id'],
  //     });
  //   if (!relationToDelete)
  //     throw new NotFoundException(
  //       `Relation between user ${userId} and user friend ${friendId} not found`,
  //     );

  //   try {
  //     const deletedRelation = await this.userRelationRepository.remove(
  //       relationToDelete,
  //     );
  //     if (deletedRelation?.id == undefined) return true;
  //     else return false;
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Error while deleting relation between user ${userId} and user friend ${friendId}`,
  //       error,
  //     );
  //   }
  // }

  // async blockUser(
  //   userId: bigint,
  //   blockedId: bigint,
  // ): Promise<UserRelationInterface> {
  //   if (userId === blockedId)
  //     throw new BadRequestException(`User ${userId} can't block himself`);

  //   const userToUpdate: UserEntity = await this.userRepository.findOne({
  //     where: { id: userId },
  //     select: [
  //       'id',
  //       'login',
  //       'email',
  //       'firstName',
  //       'lastName',
  //       'description',
  //       'avatar',
  //       'status',
  //     ],
  //   });
  //   if (!userToUpdate)
  //     throw new NotFoundException(`User with id ${userId} not found`);

  //   const userBlocked: UserEntity = await this.userRepository.findOne({
  //     where: { id: blockedId },
  //     select: [
  //       'id',
  //       'login',
  //       'email',
  //       'firstName',
  //       'lastName',
  //       'description',
  //       'avatar',
  //       'status',
  //     ],
  //   });
  //   if (!userBlocked)
  //     throw new NotFoundException(
  //       `User blocked with id ${blockedId} not found`,
  //     );

  //   const relationExist: UserRelationEntity =
  //     await this.userRelationRepository.findOne({
  //       where: { user: { id: userId }, userBlocked: { id: blockedId } },
  //       select: ['id', 'relationType'],
  //     });

  //   if (relationExist?.relationType === 'blocked')
  //     throw new BadRequestException(
  //       `User ${userId} already blocked ${blockedId}`,
  //     );

  //   const updateRelation: Partial<UserRelationEntity> = {
  //     ...relationExist,
  //     relationType: 'blocked',
  //     user: userToUpdate,
  //     userRelation: null,
  //     userBlocked: userBlocked,
  //     updatedAt: new Date(),
  //   };

  //   // try {
  //   let newRelation: UserRelationEntity;
  //   // if (relationExist?.relationType === 'friend') {
  //   //   await this.userRelationRepository.update(
  //   //     { user: { id: userId }, userRelation: { id: blockedId } },
  //   //     updateRelation,
  //   //   );
  //   //   newRelation = await this.userRelationRepository
  //   //     .createQueryBuilder('user-relation')
  //   //     .select([
  //   //       'user-relation.id',
  //   //       'user-relation.relationType',
  //   //       'user-relation.createdAt',
  //   //       'user-relation.updatedAt',
  //   //     ])
  //   //     .leftJoin('user-relation.user', 'user')
  //   //     .addSelect([
  //   //       'user.id',
  //   //       'user.login',
  //   //       'user.email',
  //   //       'user.firstName',
  //   //       'user.lastName',
  //   //       'user.description',
  //   //       'user.avatar',
  //   //       'user.status',
  //   //     ])
  //   //     .leftJoin('user-relation.userRelation', 'userRelation')
  //   //     .addSelect([
  //   //       'userRelation.id',
  //   //       'userRelation.login',
  //   //       'userRelation.email',
  //   //       'userRelation.firstName',
  //   //       'userRelation.lastName',
  //   //       'userRelation.description',
  //   //       'userRelation.avatar',
  //   //       'userRelation.status',
  //   //     ])
  //   //     .where('user.id = :userId', { userId })
  //   //     .andWhere('userRelation.id = :blockedId', { blockedId })
  //   //     .getOne();
  //   // } else

  //   //delte friend relation if exist
  //   const friendRelation: UserRelationEntity =
  //     await this.userRelationRepository.findOne({
  //       where: {
  //         user: { id: userId },
  //         relationType: 'friend',
  //         userRelation: { id: blockedId },
  //       },
  //       select: ['id'],
  //     });
  //   if (friendRelation)
  //     await this.userRelationRepository.remove(friendRelation);

  //   newRelation = await this.userRelationRepository.save(updateRelation);
  //   return newRelation;
  //   // } catch (e) {
  //   //   throw new BadRequestException(
  //   //     `User ${userId} can't block ${blockedId}`,
  //   //     e,
  //   //   );
  // }
}
