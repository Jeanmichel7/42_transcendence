import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './interfaces/users.interface';

@Injectable()
export class UsersService {
    test: Users[] = [
        {
            id: 1,
            name: "John Doe",
            firstname: "John",
            lastname: "Doe",
            email: "JohnDoe@mail.com",
            password: "123456",
            // description: "I am John Doe",
            avatar: "urlavatardude",
            isAdmin: false,
        },
        {
            id: 2,
            name: "name2",
            firstname: "firstname",
            lastname: "lastname",
            email: "email",
            password: "1234",
            avatar: "urlavatar",
            description: "I am name2",
        }
    ];

    findAll(): Users[] {
        return this.test;
    }

    findOne(id: string): Users {
        return this.test.find(user => user.id === parseInt(id));
    }

    createUser(newUser: CreateUserDto): void {
        this.test = [...this.test, newUser as Users];
    }

    updateUser(id: string, updateUser: CreateUserDto) {
        let userToUpdate = this.test.find(user => user.id === +id);
        if(!userToUpdate)
            throw new NotFoundException(`User with id ${id} not found`);
        // if (userToUpdate)
        //     this.test = this.test.map(user => user.id === +id ? updateUser as Users : user);
        if (updateUser.description)
            userToUpdate.description = updateUser.description;
        if (updateUser.hasOwnProperty('isAdmin'))
            userToUpdate.isAdmin = updateUser.isAdmin;
        if(updateUser.email)
            userToUpdate.email = updateUser.email;

        //update all data ?
        return {updated: true, user: userToUpdate};
    }

    deleteUser(id: string) {
        let userToDelete = this.test.find(user => user.id === +id);
        if(!userToDelete)
            throw new NotFoundException(`User with id ${id} not found`);
        this.test = this.test.filter(user => user.id !== +id);
        return {deleted: true, user: userToDelete};
    }
}
