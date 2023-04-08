import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

//privilégier le typage de l'entity plutôt que de l'interface
import { UserEntity } from 'src/modules/users/entity/users.entity';
import { UserCreateDTO } from './dto/user.create.dto';
import { UserInterface } from './interfaces/users.interface';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
	) { }

	async findUser(id: bigint): Promise<UserInterface> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { id: id },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "is2FAEnabled"]
		});

		if (!user)
			throw new NotFoundException(`User with id ${id} not found`);
		const result: UserInterface = { ...user };
		return result;
	}

	async findProfile(id: bigint): Promise<UserInterface> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { id: id },
			select: ["id", "firstName", "lastName", "login", "email", "description", "avatar", "role", "is2FAEnabled"]
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

	async userAlreadyExist(login: string): Promise<Boolean> {
		const user: UserEntity = await this.userRepository.findOne({
			where: { login: login },
			select: ["id"]
		});
		if (!user)
			return false;
		return true;
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

		// const salt = await bcrypt.genSalt();
		// const hash = await bcrypt.hash(newUser.password, salt);
		// // console.error("hash : ", hash);
		// newUser.password = hash;
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

	// async getJWTByHeader(req) {
	//     const authHeader = req.headers.authorization;
	//     if (authHeader) {
	//         const token = authHeader.split(' ')[1];
	//         return token;
	//     }
	//     return null;
	// }

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

	async patchUser(id: bigint, updateUser: UserCreateDTO): Promise<UserInterface> {
		let userToUpdate: UserInterface = await this.findUser(id)
		if (!userToUpdate)
			throw new NotFoundException(`User ${id} not found`);

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
}
