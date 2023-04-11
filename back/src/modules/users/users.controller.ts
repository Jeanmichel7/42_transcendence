import { Controller, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, ParseIntPipe, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { UserInterface } from './interfaces/users.interface';
import { UserCreateDTO } from './dto/user.create.dto';

import { Public } from 'src/modules/auth/decorators/public.decorator';
import { AuthOwnerAdmin } from 'src/modules/auth/guard/authAdminOwner.guard';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	@Get()
	// @UseGuards(AuthAdmin)
	async findAll(): Promise<UserInterface[]> {
		const result: UserInterface[] = await this.usersService.findAll();
		return result;
	}

	//Get profile of user
	@Get(':userId/profil')
	async findProfile(@Param('userId', ParseIntPipe) params: bigint): Promise<UserInterface> {
		const result: UserInterface = await this.usersService.findProfile(params);
		return result;
	}

	@Get(':userId')
	@UseGuards(AuthOwnerAdmin)
	async findOne(@Param('userId', ParseIntPipe) params: bigint): Promise<UserInterface> {
		const result: UserInterface = await this.usersService.findUser(params);
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

	//get old pass and crypt new pass
	@Patch(':userId')
	@UseGuards(AuthOwnerAdmin)
	@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
	async patchUser(
		@Param('userId', ParseIntPipe) id: bigint,
		@Body() body: UserCreateDTO
	): Promise<UserInterface> {
		const result: UserInterface = await this.usersService.patchUser(id, body);
		return result;
	}

	//get old pass and crypt new pass
	@Put(':userId')
	@UseGuards(AuthOwnerAdmin)
	@UsePipes(new ValidationPipe({ skipMissingProperties: true }))
	async updateUser(
		@Param('userId', ParseIntPipe) id: bigint,
		@Body() updateUser: UserCreateDTO
	) : Promise<UserInterface> {
		const result = await this.usersService.updateUser(id, updateUser);
		return result;
	}

	@Delete(':userId')
	@UseGuards(AuthOwnerAdmin)
	async deleteUser(@Param('userId', ParseIntPipe) id: bigint): Promise<HttpStatus> {
		await this.usersService.deleteUser(id);
		return HttpStatus.NO_CONTENT; // 204
	}








}
