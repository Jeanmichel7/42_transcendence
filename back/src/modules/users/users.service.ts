import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { UserCreateDTO } from './dto/user.create.dto';
import { UserInterface } from './interfaces/users.interface';
import { UserPatchDTO } from './dto/user.patch.dto';
import { UserRelationEntity } from './entity/user.relation.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(UserRelationEntity) private readonly userRelationRepository: Repository<UserRelationEntity>,
	) { }

	async findUser(id: bigint): Promise<UserInterface> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { id: id },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"]
		});

		if (!user)
			throw new NotFoundException(`User with id ${id} not found`);
		const result: UserInterface = { ...user };
		return result;
	}

	async findProfile(id: bigint): Promise<UserInterface> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { id: id },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar",]
		});

		if (!user)
			throw new NotFoundException(`User with id ${id} not found`);
		const result: UserInterface = { ...user };
		return result;
	}

	async findOneByLogin(login: string): Promise<UserInterface> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { login: login },
			select: ["id", "firstName", "lastName", "login"]
		});

		if (!user)
			throw new NotFoundException(`User ${login} not found`);
		const result: UserInterface = { ...user };
		return result;
	}

	async findAll(): Promise<UserInterface[]> {
		const users: UserEntity[] = await this.userRepository.find({
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"]
		});
		if (!users)
			throw new NotFoundException(`Users not found`);
		const result: UserInterface[] = { ...users };
		return result;
	}

	async createUser(newUser: UserCreateDTO): Promise<UserEntity> {
		const result: UserEntity = await this.userRepository.findOneBy({ login: newUser.login });
		if (result)
			throw new NotFoundException(`User ${newUser.login} already exist`);

		const salt: string = await bcrypt.genSalt();
		const hash: string = await bcrypt.hash(newUser.password, salt);
		newUser.password = hash;
		return this.userRepository.save(newUser);
	}

	async createOAuthUser(data): Promise<UserInterface> {
		// console.log("data ne wuser: ", data);
		const newUser = new UserEntity();
		newUser.firstName = data.first_name;
		newUser.lastName = data.last_name;
		newUser.login = data.login;
		newUser.email = data.email;
		// newUser.password = data.password;
		newUser.description = data.description;
		newUser.avatar = data.image.link;

		const user: UserEntity = await this.userRepository.save(newUser);
		if (!user)
			throw new NotFoundException(`User ${newUser.login} not created`);
		const result: UserInterface = { ...user };
		return result;
	}

	async patchUser(id: bigint, updateUser: UserPatchDTO): Promise<UserInterface> {
		let userToUpdate: UserInterface = await this.findUser(id)
		if (!userToUpdate)
			throw new NotFoundException(`User ${id} not found`);

		// crypt new password

		const updateData: Partial<UserEntity> = {};
		if (updateUser.firstName) updateData.firstName = updateUser.firstName;
		if (updateUser.lastName) updateData.lastName = updateUser.lastName;
		if (updateUser.login) updateData.login = updateUser.login;
		if (updateUser.email) updateData.email = updateUser.email;
		if (updateUser.password) updateData.password = updateUser.password;
		if (updateUser.description) updateData.description = updateUser.description;
		if (updateUser.avatar) updateData.avatar = updateUser.avatar;
	
		if (Object.keys(updateData).length > 0) {
			if((await this.userRepository.update({ id: id }, updateData)).affected === 0)
				throw new BadRequestException(`User ${id} has not been updated.`);
		}

		const result: UserInterface = await this.findUser(id);
		return result;
	}

	async updateUser(id: bigint, updateUser: UserCreateDTO): Promise<UserInterface> {
		let userToUpdate: UserInterface = await this.findUser(id)
		if (!userToUpdate)
			throw new NotFoundException(`User ${id} not found`);

		let res = await this.userRepository.update({ id: id }, updateUser);
		if(res.affected === 0)
			throw new BadRequestException(`User ${id} has not been updated.`);

		const result: UserInterface = await this.findUser(id);
		return result;
	}

	async deleteUser(id: bigint): Promise<void | string> {
		let userFound = await this.findUser(id);
		if (!userFound)
			throw new NotFoundException(`User with id ${id} not found`);

		const result = await this.userRepository.delete({ id: id });
		if (result.affected === 0)
			return `User ${id} not deleted`;
	}




	/* ************************************************ */
	/*                                                  */
	/*                         2FA                      */
	/*                                                  */
	/* ************************************************ */
	
	async active2fa(userId: bigint): Promise<UserInterface> {
		let userToUpdate: UserInterface = await this.findUser(userId)
		if (!userToUpdate)
			throw new NotFoundException(`User with id ${userId} not found`);

		let resultUpdate = await this.userRepository.update({ id: userId }, { is2FAEnabled: true });
		if (resultUpdate.affected === 0)
			throw new BadRequestException(`L'option 2FA de l'user ${userId} has not be enabled.`);

		const user = await this.findUser(userId);
		return user;
	}

	async desactive2fa(userId: bigint): Promise<UserInterface> {
		let userToUpdate = await this.findUser(userId)
		if (!userToUpdate)
			throw new NotFoundException(`User with id ${userId} not found`);

		let resultUpdate = await this.userRepository.update({ id: userId }, { is2FAEnabled: false });
		if (resultUpdate.affected === 0)
			throw new BadRequestException(`2FA of user ${userId} has not been disabled.`);

		const user = await this.findUser(userId);
		return user;
	}






	/* ************************************************ */
	/*                                                  */
	/*                      FRIENDS                     */
	/*                                                  */
	/* ************************************************ */

	async addFriend(userId: bigint, friendId: bigint) {
		const userToUpdate: UserEntity = await this.userRepository.findOne({
			where: { id: userId },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"],
			relations: ["friends"]
		});

		if(userToUpdate.id === friendId)
			throw new BadRequestException(`User ${userId} can't add himself as friend`);

		if (!userToUpdate)
			throw new NotFoundException(`User with id ${userId} not found`);

		const userFriend: UserEntity = await this.userRepository.findOne({
			where: { id: friendId },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar"],
			// relations: ["friends"]
		});
		if(!userFriend)
			throw new NotFoundException(`User with id ${friendId} not found`);

		// if(userToUpdate.friends.length > 0) {
		// 	for (let i = 0; i < userToUpdate.friends.length; i++) {
		// 		if(userToUpdate.friends[i].id === friendId)
		// 			throw new BadRequestException(`User ${userId} already have friend ${friendId}`);
		// 	}
		// }
		console.error("user friend : ", userFriend)

		await this.userRelationRepository.save({
			userId: userId,
			relationType: "friend",
			userFriend: userFriend
		})


		console.error("user friends avant : ", userToUpdate.friends)
		userToUpdate.friends.push(userFriend);
		const resultSave = await this.userRepository.save(userToUpdate.friends);
		console.error("user friends apres : ", userToUpdate.friends)

		console.error("result : ", resultSave)


		const user: UserEntity = await this.userRepository.findOne({
			where: { id: userId },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"],
			relations: ["friends"]
		});
		if (!user)
			throw new NotFoundException(`User with id ${userId} not found`);
		console.error("user : ", user)


		return resultSave;
	}

	async getAllFriendsofUser(userId: bigint): Promise<UserInterface[]> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { id: userId },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"],
			relations: ["friends"]
		});
		if (!user)
			throw new NotFoundException(`User with id ${userId} not found`);
		console.error("user : ", user)


		const friends: UserInterface[] = [];
		for (let i = 0; i < user.friends.length; i++) {
			friends.push(user.friends[i]);
		}
		return friends;
	}







	/* ************************************************ */
	/*                                                  */
	/*                       TOOLS                      */
	/*                                                  */
	/* ************************************************ */


	private async userExist(userId: bigint): Promise<Boolean> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { id: userId },
			select: ["id"]
		});
		if (!user)
			return false;
		return true;
	}

}
