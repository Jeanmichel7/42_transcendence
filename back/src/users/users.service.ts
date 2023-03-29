import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//privilégier le typage de l'entity plutôt que de l'interface
import { UserInfo } from 'src/typeorm';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserInfo) private readonly userRepository: Repository<UserInfo>,
    ) {}

    async findAll(): Promise<UserInfo[]> {
        const users = this.userRepository.find();
        if(!users)
            throw new NotFoundException(`Users not found`);
        return users;
    }

    async findOne(id: bigint): Promise<UserInfo> {
        let userFind = await this.userRepository.findOneBy({id: id});

        if(!userFind)
            throw new NotFoundException(`User with id ${id} not found`);
        return userFind;
    }

    async findOneWithMessages(id: bigint): Promise<UserInfo> {
        let userFind = await this.userRepository.findOne({
            where: {id: id},
            relations: ["messagesSend", "messagesReceive"]
        });

        if(!userFind)
            throw new NotFoundException(`User with id ${id} not found`);
        return userFind;
    }

    createUser(newUser: CreateUserDto): Promise<UserInfo> {
        return this.userRepository.save(newUser);
    }

    async patchUser(id: bigint, updateUser: CreateUserDto): Promise<UserInfo> {
        // console.log("updateUser : ", updateUser)

        let userToUpdate = await this.findOne(id)
        // console.log("userToUpdate : ", userToUpdate)

        if(!userToUpdate)
        throw new NotFoundException(`User with id ${id} not found`);
        
        // check auth

        let res;
        if(updateUser.firstName)
            res = await this.userRepository.update({id: id}, {firstName: updateUser.firstName});
        if(updateUser.lastName)
            res = await this.userRepository.update({id: id}, {lastName: updateUser.lastName});
        if(updateUser.pseudo)
            res = await this.userRepository.update({id: id}, {pseudo: updateUser.pseudo});
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
        // console.log("updateUser : ", updateUser)

        let userToUpdate = await this.findOne(id)
        // console.log("userToUpdate : ", userToUpdate)

        if(!userToUpdate)
        throw new NotFoundException(`User with id ${id} not found`);
        
        // check auth

        let res = await this.userRepository.update({id: id}, updateUser);        

        // check res
        // return { update: true, user: updateUser, data: res };

        const result = await this.findOne(id);
        return result;
    }

    async deleteUser(id: bigint): Promise<void> {
        // check user exist
        let userFound = await this.findOne(id);

        if(!userFound)
            throw new NotFoundException(`User with id ${id} not found`);

        // check auth 

        // delete user
        
        this.userRepository.delete({id: id});
    }
}
