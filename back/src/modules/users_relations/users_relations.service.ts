import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
        .leftJoin('user_relation.user', 'user')
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
        .getMany();
    return userRelations;
  }

  async getAllFriendsofUser(userId: bigint): Promise<UserInterface[]> {
    const userRelations: UserRelationEntity[] =
      await this.userRelationRepository.find({
        where: { user: { id: userId }, relationType: 'friend' },
        relations: ['userRelation'],
      });
    const allFriends: UserInterface[] = userRelations.map((relation) => {
      return {
        id: relation.userRelation.id,
        firstName: relation.userRelation.firstName,
        lastName: relation.userRelation.lastName,
        login: relation.userRelation.login,
        email: relation.userRelation.email,
        description: relation.userRelation.description,
        avatar: relation.userRelation.avatar,
        status: relation.userRelation.status,
      };
    });
    return allFriends;
  }

  async getAllBlockedUsers(userId: bigint): Promise<UserInterface[]> {
    const userRelations: UserRelationEntity[] =
      await this.userRelationRepository.find({
        where: { user: { id: userId }, relationType: 'blocked' },
        relations: ['userRelation'],
      });
    const allBlockedUsers: UserInterface[] = userRelations.map((relation) => {
      return {
        id: relation.userRelation.id,
        firstName: relation.userRelation.firstName,
        lastName: relation.userRelation.lastName,
        login: relation.userRelation.login,
        email: relation.userRelation.email,
        description: relation.userRelation.description,
        avatar: relation.userRelation.avatar,
        status: relation.userRelation.status,
      };
    });
    return allBlockedUsers;
  }

  async addFriend(
    userId: bigint,
    friendId: bigint,
  ): Promise<UserRelationInterface> {
    if (userId === friendId)
      throw new BadRequestException(
        `User ${userId} can't add himself as friend`,
      );

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
    });
    if (!userFriend)
      throw new NotFoundException(`User friend with id ${friendId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: { user: { id: userId }, userRelation: { id: friendId } },
        select: ['id', 'relationType'],
      });
    console.log(relationExist);
    if (relationExist?.relationType == 'friend')
      throw new BadRequestException(
        `User ${userFriend.login} already your friend`,
      );

    const updateRelation: Partial<UserRelationEntity> = {
      ...relationExist,
      relationType: 'friend',
      user: userToUpdate,
      userRelation: userFriend,
      updatedAt: new Date(),
    };

    try {
      let newRelation: UserRelationEntity;
      if (relationExist?.relationType === 'blocked') {
        await this.userRelationRepository.update(
          { user: { id: userId }, userRelation: { id: friendId } },
          updateRelation,
        );
        newRelation = await this.userRelationRepository
          .createQueryBuilder('user_relation')
          .select([
            'user_relation.id',
            'user_relation.relationType',
            'user_relation.createdAt',
            'user_relation.updatedAt',
          ])
          .leftJoin('user_relation.user', 'user')
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
          .andWhere('userRelation.id = :friendId', { friendId })
          .getOne();
      } else
        newRelation = await this.userRelationRepository.save(updateRelation);
      return newRelation;
    } catch (e) {
      throw new BadRequestException(
        `User ${userId} can't block ${friendId}`,
        e,
      );
    }
  }

  async deleteRelation(userId: bigint, friendId: bigint): Promise<boolean> {
    if (userId === friendId)
      throw new BadRequestException(
        `User ${userId} can't delete himself as friend`,
      );

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
    });
    if (!userFriend)
      throw new NotFoundException(`User friend with id ${friendId} not found`);

    // check if relation already exist
    const relationExist: UserRelationEntity[] =
      await this.userRelationRepository.find({
        where: {
          user: { id: userId },
          relationType: 'friend',
          userRelation: { id: friendId },
        },
        select: ['id'],
      });
    if (relationExist?.length === 0)
      throw new BadRequestException(
        `User ${userId} don't have ${friendId} as friend`,
      );

    // delete relation in users_relation table
    const relationToDelete: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: {
          user: { id: userId },
          relationType: 'friend',
          userRelation: { id: friendId },
        },
        select: ['id'],
      });
    if (!relationToDelete)
      throw new NotFoundException(
        `Relation between user ${userId} and user friend ${friendId} not found`,
      );

    try {
      const deletedRelation = await this.userRelationRepository.remove(
        relationToDelete,
      );
      if (deletedRelation?.id == undefined) return true;
      else return false;
    } catch (error) {
      throw new BadRequestException(
        `Error while deleting relation between user ${userId} and user friend ${friendId}`,
        error,
      );
    }
  }

  async blockUser(
    userId: bigint,
    blockedId: bigint,
  ): Promise<UserRelationInterface> {
    if (userId === blockedId)
      throw new BadRequestException(`User ${userId} can't block himself`);

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
    });
    if (!userToUpdate)
      throw new NotFoundException(`User with id ${userId} not found`);

    const userBlocked: UserEntity = await this.userRepository.findOne({
      where: { id: blockedId },
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
    });
    if (!userBlocked)
      throw new NotFoundException(
        `User blocked with id ${blockedId} not found`,
      );

    const relationExist: UserRelationEntity =
      await this.userRelationRepository.findOne({
        where: { user: { id: userId }, userRelation: { id: blockedId } },
        select: ['id', 'relationType'],
      });

    if (relationExist?.relationType === 'blocked')
      throw new BadRequestException(
        `User ${userId} already blocked ${blockedId}`,
      );

    const updateRelation: Partial<UserRelationEntity> = {
      ...relationExist,
      relationType: 'blocked',
      user: userToUpdate,
      userRelation: userBlocked,
      updatedAt: new Date(),
    };

    try {
      let newRelation: UserRelationEntity;
      if (relationExist?.relationType === 'friend') {
        await this.userRelationRepository.update(
          { user: { id: userId }, userRelation: { id: blockedId } },
          updateRelation,
        );
        newRelation = await this.userRelationRepository
          .createQueryBuilder('user_relation')
          .select([
            'user_relation.id',
            'user_relation.relationType',
            'user_relation.createdAt',
            'user_relation.updatedAt',
          ])
          .leftJoin('user_relation.user', 'user')
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
          .andWhere('userRelation.id = :blockedId', { blockedId })
          .getOne();
      } else
        newRelation = await this.userRelationRepository.save(updateRelation);
      return newRelation;
    } catch (e) {
      throw new BadRequestException(
        `User ${userId} can't block ${blockedId}`,
        e,
      );
    }
  }
}
