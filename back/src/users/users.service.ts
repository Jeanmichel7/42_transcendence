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

    findAll(): Promise<UserInfo[]> {
        return this.userRepository.find();
    }

    findOne(id: string): Promise<UserInfo> {
        return this.userRepository.findOneBy({id: parseInt(id)});
    }

    createUser(newUser: CreateUserDto): Promise<UserInfo> {
        return this.userRepository.save(newUser);
    }

    async updateUser(id: string, updateUser: CreateUserDto): Promise<UserInfo> {
        // console.log("updateUser : ", updateUser)

        let userToUpdate = await this.findOne(id)
        // console.log("userToUpdate : ", userToUpdate)

        if(!userToUpdate)
        throw new NotFoundException(`User with id ${id} not found`);
        
        // check auth

        let res;
        if(updateUser.firstName)
            res = await this.userRepository.update({id: parseInt(id)}, {firstName: updateUser.firstName});
        if(updateUser.lastName)
            res = await this.userRepository.update({id: parseInt(id)}, {lastName: updateUser.lastName});
        if(updateUser.pseudo)
            res = await this.userRepository.update({id: parseInt(id)}, {pseudo: updateUser.pseudo});
        if(updateUser.email)
            res = await this.userRepository.update({id: parseInt(id)}, {email: updateUser.email});
        if(updateUser.password)
            res = await this.userRepository.update({id: parseInt(id)}, {password: updateUser.password});
        if(updateUser.description)
            res = await this.userRepository.update({id: parseInt(id)}, {description: updateUser.description});
        if(updateUser.avatar)
            res = await this.userRepository.update({id: parseInt(id)}, {avatar: updateUser.avatar});

        // check res
        // return { update: true, user: updateUser, data: res };

        const result = await this.findOne(id);
        return result;
    }

    async deleteUser(id: string): Promise<void> {
        // check user exist
        let userFound = await this.findOne(id);

        if(!userFound)
            throw new NotFoundException(`User with id ${id} not found`);

        // check auth 

        // delete user
        
        this.userRepository.delete({id: parseInt(id)});
    }
}
