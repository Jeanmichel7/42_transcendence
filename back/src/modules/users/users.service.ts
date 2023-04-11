import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from 'src/modules/users/entity/users.entity';
import { UserCreateDTO } from './dto/user.create.dto';
import { UserInterface } from './interfaces/users.interface';
import { UserPatchDTO } from './dto/user.patch.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
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

	/* probably useless but I keep it for now */
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
		let login: string = data.login;
		if(!this.isLoginAvailable(login))
			login = login + Math.floor(Math.random() * 1000);

		const newUser = new UserEntity();
		newUser.firstName = data.first_name;
		newUser.lastName = data.last_name;
		newUser.login = login;
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

		let res = await this.userRepository.update({ id: id }, {
			...updateUser,
			// password: await bcrypt.hash(updateUser.password, 10),
			updatedAt: new Date()
		});
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

	private async isLoginAvailable(login: string): Promise<Boolean> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { login: login },
			select: ["id"]
		});
		if (!user)
			return true;
		return false;
	}


	// private async isEmailAvailable(email: string): Promise<Boolean> {
	// 	const user: UserEntity = await this.userRepository.findOne({
	// 		where: { email: email },
	// 		select: ["id"]
	// 	});
	// 	if (!user)
	// 		return true;
	// 	return false;
	// }


}
