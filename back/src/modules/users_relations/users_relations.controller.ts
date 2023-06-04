import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Req,
  // UseGuards,
} from '@nestjs/common';

import { UsersRelationsService } from './users_relations.service';

import { UserInterface } from 'src/modules/users/interfaces/users.interface';
import { UserRelationInterface } from './interfaces/users_relations.interface';
import { RequestWithUser } from '../users/interfaces/request.user.interface';

// import { AuthAdmin } from '../auth/guard/authAdmin.guard';

@Controller('relations')
export class UsersRelationsController {
  constructor(private readonly usersRelationsService: UsersRelationsService) {}

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<UserRelationInterface[]> {
    const result: UserRelationInterface[] =
      await this.usersRelationsService.getAllRelations(req.user.id);
    return result;
  }

  @Get('profilefriends/:login')
  async findFriends(@Param('login') login: string): Promise<UserInterface[]> {
    const result: UserInterface[] =
      await this.usersRelationsService.getAllFriendsofUserByLogin(login);
    return result;
  }

  @Get('friends')
  async allFriends(@Req() req: RequestWithUser): Promise<UserInterface[]> {
    const result: UserInterface[] =
      await this.usersRelationsService.getAllFriendsofUser(req.user.id);
    return result;
  }

  @Get('blocked')
  async allBlocked(@Req() req: RequestWithUser): Promise<UserInterface[]> {
    const result: UserInterface[] =
      await this.usersRelationsService.getAllBlockedUsers(req.user.id);
    return result;
  }

  @Put('friends/:friendId/add')
  async addFriend(
    @Req() req: RequestWithUser,
    @Param('friendId', ParseIntPipe) friendId: bigint,
  ): Promise<UserRelationInterface> {
    const result: UserRelationInterface =
      await this.usersRelationsService.addFriend(req.user.id, friendId);
    return result;
  }

  @Delete('friends/:friendId/delete')
  async removeFriend(
    @Req() req: RequestWithUser,
    @Param('friendId', ParseIntPipe) friendId: bigint,
  ): Promise<HttpStatus> {
    await this.usersRelationsService.deleteRelation(req.user.id, friendId);
    return HttpStatus.NO_CONTENT;
  }

  @Put('friends/:userBlockedId/block')
  // @UseGuards(AuthOwnerAdmin)
  async blockFriend(
    @Req() req: RequestWithUser,
    @Param('userBlockedId', ParseIntPipe) userBlockedId: bigint,
  ): Promise<UserRelationInterface> {
    const result: UserRelationInterface =
      await this.usersRelationsService.blockUser(req.user.id, userBlockedId);
    return result;
  }

  /* ************************************************ */
  /*         ???          ADMIN          ???          */
  /* ************************************************ */

  @Get(':userId')
  // @UseGuards(AuthAdmin)
  async adminFindAll(
    @Param('userId', ParseIntPipe) id: bigint,
  ): Promise<UserRelationInterface[]> {
    const result: UserRelationInterface[] =
      await this.usersRelationsService.getAllRelations(id);
    return result;
  }

  @Get(':userId/friends')
  // @UseGuards(AuthAdmin)
  async adminAllFriends(
    @Param('userId', ParseIntPipe) userId: bigint,
  ): Promise<UserInterface[]> {
    const result: UserInterface[] =
      await this.usersRelationsService.getAllFriendsofUser(userId);
    return result;
  }

  @Get(':userId/blocked')
  // @UseGuards(AuthAdmin)
  async adminAllBlocked(
    @Param('userId', ParseIntPipe) userId: bigint,
  ): Promise<UserInterface[]> {
    const result: UserInterface[] =
      await this.usersRelationsService.getAllBlockedUsers(userId);
    return result;
  }

  @Put(':userId/add-friend/:friendId')
  // @UseGuards(AuthAdmin)
  async adminAddFriend(
    @Param('userId', ParseIntPipe) userId: bigint,
    @Param('friendId', ParseIntPipe) friendId: bigint,
  ): Promise<UserRelationInterface> {
    const result: UserRelationInterface =
      await this.usersRelationsService.addFriend(userId, friendId);
    return result;
  }

  @Delete(':userId/delete-relation/:friendId')
  // @UseGuards(AuthAdmin)
  async adminRemoveFriend(
    @Param('userId', ParseIntPipe) userId: bigint,
    @Param('friendId', ParseIntPipe) friendId: bigint,
  ): Promise<HttpStatus> {
    await this.usersRelationsService.deleteRelation(userId, friendId);
    return HttpStatus.NO_CONTENT; // 204
  }

  @Put(':userId/block-user/:userBlockedId')
  // @UseGuards(AuthAdmin)
  async adminBlockFriend(
    @Param('userId', ParseIntPipe) userId: bigint,
    @Param('userBlockedId', ParseIntPipe) friendId: bigint,
  ): Promise<UserRelationInterface> {
    const result: UserRelationInterface =
      await this.usersRelationsService.blockUser(userId, friendId);
    return result;
  }
}
