import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

//privilégier le typage de l'entity plutôt que de l'interface
import { UserInfo } from 'src/typeorm';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserInfo) private readonly userRepository: Repository<UserInfo>,
    ) {}

    async findOne(id: bigint): Promise<UserInfo> {
        let userFind = await this.userRepository.findOneBy({id: id});

        if(!userFind)
            throw new NotFoundException(`User with id ${id} not found`);
        return userFind;
    }

    async findOneByLogin(login: string): Promise<UserInfo> {
        let userFind = await this.userRepository.findOneBy({login: login});
        if(!userFind)
            throw new NotFoundException(`User ${login} not found`);
        return userFind;
    }

    async userAlreadyExist(login: string): Promise<Boolean> {
        let userFind = await this.userRepository.findOneBy({login: login});
        if(!userFind)
            return false;
        return true;
    }

    async findAll(): Promise<UserInfo[]> {
        const users = this.userRepository.find();
        if(!users)
            throw new NotFoundException(`Users not found`);
        return users;
    }

    async findOneWithMessages(id: bigint): Promise<UserInfo> {
        let userFund = await this.userRepository.findOne({
            where: {id: id},
            relations: ["messagesSend", "messagesReceive"]
        });
        if(!userFund)
            throw new NotFoundException(`User with id ${id} not found`);
        return userFund;
    }

    async createUser(newUser: CreateUserDto): Promise<UserInfo> {
        const result = await this.userRepository.findOneBy({login: newUser.login});
        if(result)
            throw new NotFoundException(`User ${newUser.login} already exist`);

        // const salt = await bcrypt.genSalt();
        // const hash = await bcrypt.hash(newUser.password, salt);
        // // console.error("hash : ", hash);
        // newUser.password = hash;
        return this.userRepository.save(newUser);
    }

    async createOAuthUser(data) {
        // console.log("data ne wuser: ", data);
        const newUser = new UserInfo();
        newUser.firstName = data.first_name;
        newUser.lastName = data.last_name;
        newUser.login = data.login;
        newUser.email = data.email;
        // newUser.password = data.password;
        // newUser.description = data.description;
        newUser.avatar = data.image.link;

        return await this.userRepository.save(newUser);
    }

    // async getJWTByHeader(req) {
    //     const authHeader = req.headers.authorization;
    //     if (authHeader) {
    //         const token = authHeader.split(' ')[1];
    //         return token;
    //     }
    //     return null;
    // }

    async active2fa(userId: bigint): Promise<UserInfo> {
        let userToUpdate = await this.findOne(userId)
        if(!userToUpdate)
            throw new NotFoundException(`User with id ${userId} not found`);

        let resultUpdate = await this.userRepository.update({id: userId}, {is_2fa: true});
        if (resultUpdate.affected === 0)
            throw new BadRequestException(`L'option 2FA de l'user ${userId} n'a pas été mise a jour.`);

        const user = await this.findOne(userId);
        return user;
    }

    async desactive2fa(userId: bigint): Promise<UserInfo> {
        let userToUpdate = await this.findOne(userId)
        if(!userToUpdate)
            throw new NotFoundException(`User with id ${userId} not found`);

        let resultUpdate = await this.userRepository.update({id: userId}, {is_2fa: false});
        if (resultUpdate.affected === 0)
            throw new BadRequestException(`L'option 2FA de l'user ${userId} n'a pas été mise a jour.`);

        const user = await this.findOne(userId);
        return user;
    }

    async patchUser(id: bigint, updateUser: CreateUserDto): Promise<UserInfo> {
        // console.log("updateUser : ", updateUser)

        let userToUpdate = await this.findOne(id)
        if(!userToUpdate)
            throw new NotFoundException(`User with id ${id} not found`);

        let res;
        if(updateUser.firstName)
            res = await this.userRepository.update({id: id}, {firstName: updateUser.firstName});
        if(updateUser.lastName)
            res = await this.userRepository.update({id: id}, {lastName: updateUser.lastName});
        if(updateUser.login)
            res = await this.userRepository.update({id: id}, {login: updateUser.login});
        if(updateUser.email)
            res = await this.userRepository.update({id: id}, {email: updateUser.email});
        if(updateUser.password)
            res = await this.userRepository.update({id: id}, {password: updateUser.password});
        if(updateUser.description)
            res = await this.userRepository.update({id: id}, {description: updateUser.description});
        if(updateUser.avatar)
            res = await this.userRepository.update({id: id}, {avatar: updateUser.avatar});

        // check res
        // return { update: true, user: updateUser, data: res };

        const result = await this.findOne(id);
        return result;
    }

    async updateUser(id: bigint, updateUser: CreateUserDto): Promise<UserInfo> {

        let userToUpdate = await this.findOne(id)
        if(!userToUpdate)
            throw new NotFoundException(`User with id ${id} not found`);
        
        let res = await this.userRepository.update({id: id}, updateUser);

        // check res
        // return { update: true, user: updateUser, data: res };

        const result = await this.findOne(id);
        return result;
    }

    async deleteUser(id: bigint): Promise<void> {
        let userFound = await this.findOne(id);
        if(!userFound)
            throw new NotFoundException(`User with id ${id} not found`);

        const result = await this.userRepository.delete({id: id});
        // console.log("result : ", result)
    }
}
