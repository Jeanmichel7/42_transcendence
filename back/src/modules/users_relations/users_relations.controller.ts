import { Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';

import { UsersRelationsService } from './users_relations.service';

import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { UserRelationInterface } from './interfaces/users_relations.interface';

import { AuthOwnerAdmin } from 'src/modules/auth/guard/authAdminOwner.guard';
import { AuthAdmin } from '../auth/guard/authAdmin.guard';

@Controller('relations')
export class UsersRelationsController {
  constructor(
    private readonly usersRelationsService: UsersRelationsService,
  ) { }

  @Get(':userId')
  @UseGuards(AuthOwnerAdmin)
  async findOne(@Param('userId', ParseIntPipe) id: bigint): Promise<UserRelationInterface[]> {
    const result: UserRelationInterface[] = await this.usersRelationsService.getAllRelations(id);
    return result;
  }

  @Get(':userId/friends')
  @UseGuards(AuthOwnerAdmin)
  async allFriends(@Param('userId', ParseIntPipe) userId: bigint): Promise<UserInterface[]> {
    const result: UserInterface[] = await this.usersRelationsService.getAllFriendsofUser(userId);
    return result;
  }

  @Get(':userId/blocked')
  @UseGuards(AuthOwnerAdmin)
  async allBlocked(@Param('userId', ParseIntPipe) userId: bigint): Promise<UserInterface[]> {
    const result: UserInterface[] = await this.usersRelationsService.getAllBlockedUsers(userId);
    return result;
  }

  @Put(':userId/add-friend/:friendId')
  @UseGuards(AuthOwnerAdmin)
  async addFriend(
    @Param('userId', ParseIntPipe) userId: bigint,
    @Param('friendId', ParseIntPipe) friendId: bigint
  ): Promise<UserRelationInterface> {
    const result: UserRelationInterface = await this.usersRelationsService.addFriend(userId, friendId);
    return result;
  }

  @Delete(':userId/delete-relation/:friendId')
  @UseGuards(AuthOwnerAdmin)
  async removeFriend(
    @Param('userId', ParseIntPipe) userId: bigint,
    @Param('friendId', ParseIntPipe) friendId: bigint
  ): Promise<HttpStatus> {
    const result: Boolean = await this.usersRelationsService.deleteRelation(userId, friendId);
    return HttpStatus.NO_CONTENT; // 204
  }

  @Put(':userId/block-user/:userBlockedId')
  @UseGuards(AuthOwnerAdmin)
  async blockFriend(
    @Param('userId', ParseIntPipe) userId: bigint,
    @Param('userBlockedId', ParseIntPipe) friendId: bigint
  ): Promise<UserRelationInterface> {
    const result: UserRelationInterface = await this.usersRelationsService.blockUser(userId, friendId);
    return result;
  }

}
