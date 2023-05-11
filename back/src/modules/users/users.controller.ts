import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  // Put,
  Delete,
  HttpStatus,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  // UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UserInterface } from './interfaces/users.interface';
import { UserCreateDTO } from './dto/user.create.dto';

import { Public } from 'src/modules/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilInterface } from './interfaces/profil.interface';
import { RequestWithUser } from './interfaces/request.user.interface';
// import { AuthAdmin } from '../auth/guard/authAdmin.guard';
import { UserPatchDTO } from './dto/user.patch.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get user data
  @Get()
  async findOne(@Req() req: RequestWithUser): Promise<UserInterface> {
    const result: UserInterface = await this.usersService.findUser(req.user.id);
    return result;
  }

  @Get(':userId/alldata')
  async findUser(
    @Param('userId', ParseIntPipe) userId: bigint,
  ): Promise<UserInterface> {
    const result: UserInterface = await this.usersService.findUserAllData(
      userId,
    );
    return result;
  }

  //Get public profile of user
  @Get(':userlogin/profile')
  async findProfile(
    @Param('userlogin') params: string,
  ): Promise<ProfilInterface> {
    const result: ProfilInterface = await this.usersService.findProfile(params);
    return result;
  }

  @Get(':userId/profileById')
  async findProfileById(
    @Param('userId') params: bigint,
  ): Promise<ProfilInterface> {
    const result: ProfilInterface = await this.usersService.findProfileById(
      params,
    );
    return result;
  }

  /* probably useless but I keep it for now */
  @Post('sign-in')
  @Public()
  @UsePipes(ValidationPipe)
  async createUser(@Body() newUser: UserCreateDTO): Promise<UserInterface> {
    const result: UserInterface = await this.usersService.createUser(newUser);
    return result;
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async patchUser(
    @Req() req: RequestWithUser,
    @Body() body: UserPatchDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserInterface> {
    const result: UserInterface = await this.usersService.patchUser(
      req.user.id,
      body,
      file,
    );
    return result;
  }

  // @Put(':userId')
  // // @UseGuards(AuthOwnerAdmin)
  // @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  // async updateUser(
  // 	@Param('userId', ParseIntPipe) id: bigint,
  // 	@Body() updateUser: UserCreateDTO
  // ) : Promise<UserInterface> {
  // 	const result = await this.usersService.updateUser(id, updateUser);
  // 	return result;
  // }

  @Delete()
  async deleteUser(@Req() req: RequestWithUser): Promise<HttpStatus> {
    await this.usersService.deleteUser(req.user.id);
    return HttpStatus.NO_CONTENT; // 204
  }

  /* ************************************************ */
  /*                      ADMIN                       */
  /* ************************************************ */

  /*
  @Get('all')
  // @UseGuards(AuthAdmin)
  async findAll(): Promise<UserInterface[]> {
    const result: UserInterface[] = await this.usersService.findAll();
    return result;
  }
*/
  @Get(':userId')
  // @UseGuards(AuthAdmin)
  async adminFindOne(
    @Param('userId', ParseIntPipe) params: bigint,
  ): Promise<UserInterface> {
    const result: UserInterface = await this.usersService.findUser(params);
    return result;
  }

  @Patch(':userId')
  // @UseGuards(AuthAdmin)
  @UseInterceptors(FileInterceptor('avatar'))
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async adminPatchUser(
    @Param('userId', ParseIntPipe) id: bigint,
    @Body() body: UserPatchDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserInterface> {
    const result: UserInterface = await this.usersService.patchUser(
      id,
      body,
      file,
    );
    return result;
  }

  @Delete(':userId')
  // @UseGuards(AuthOwnerAdmin)
  async adminDeleteUser(
    @Param('userId', ParseIntPipe) id: bigint,
  ): Promise<HttpStatus> {
    await this.usersService.deleteUser(id);
    return HttpStatus.NO_CONTENT; // 204
  }
}
