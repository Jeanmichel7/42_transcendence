import { Controller, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, HttpCode, ParseIntPipe, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { UserInterface } from './interfaces/users.interface';
import { UserCreateDTO } from './dto/user.create.dto';

import { Public } from 'src/modules/auth/decorators/public.decorator';
import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';
import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
import { UserEntity } from './entity/users.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Get()
	@UseGuards(AuthAdmin)
	async findAll(): Promise<UserInterface[]> {
		const result: UserInterface[] = await this.usersService.findAll();
		return result;
	}

	@Get(':userId')
	async findOne(@Param('userId', ParseIntPipe) params: bigint): Promise<UserInterface> {
		const result: UserInterface = await this.usersService.findUser(params);
		return result;
	}

	/* probably useless but I keep it for now */
	@Post('signIn')
	@Public()
	@UsePipes(ValidationPipe)
	async createUser(@Body() newUser: UserCreateDTO): Promise<UserInterface> {
		const result: UserInterface = await this.usersService.createUser(newUser);
		return result;
	}

	@Patch(':userId')
	@UseGuards(AuthOwner, AuthAdmin)
	@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
	async patchUser(
		@Param('userId', ParseIntPipe) id: bigint,
		@Body() body: UserCreateDTO
	): Promise<UserInterface> {
		const result: UserInterface = await this.usersService.patchUser(id, body);
		return result;
	}

	@Put(':userId')
	@UseGuards(AuthOwner, AuthAdmin)
	@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
	async updateUser(
		@Param('userId', ParseIntPipe) id: bigint,
		@Body() updateUser: UserCreateDTO
	) : Promise<UserInterface> {
		const result = await this.usersService.updateUser(id, updateUser);
		return result;
	}

	@Delete(':userId')
	@UseGuards(AuthOwner, AuthAdmin)
	async deleteUser(@Param('userId', ParseIntPipe) id: bigint): Promise<HttpStatus> {
		await this.usersService.deleteUser(id);
		return HttpStatus.NO_CONTENT; // 204
	}








	/* ************************************************ */
	/*                                                  */
	/*                         2FA                      */
	/*                                                  */
	/* ************************************************ */

	@Get(':userId/active2fa')
	@UseGuards(AuthOwner, AuthAdmin)
	async active2fa(@Param('userId', ParseIntPipe) userId: bigint): Promise<UserInterface> {
		// console.error("new user : ", newUser);
		const result: UserInterface = await this.usersService.active2fa(userId);
		return result;
	}

	@Get(':userId/desactive2fa')
	@UseGuards(AuthOwner, AuthAdmin)
	async desactive2fa(@Param('userId', ParseIntPipe) userId: bigint): Promise<UserInterface> {
		// console.error("new user : ", newUser);
		const result: UserInterface = await this.usersService.desactive2fa(userId);
		return result;
	}



	/* ************************************************ */
	/*                                                  */
	/*                      FRIENDS                     */
	/*                                                  */
	/* ************************************************ */

	//addfrinds
	//bloquefriend
	//removefriend



}
