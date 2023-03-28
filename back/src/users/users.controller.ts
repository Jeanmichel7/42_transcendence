import { Controller, Get, Post, Body, Param, Patch, Delete, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

//privilégier le typage de l'interace plutôt que de l'entité
import { Users } from './interfaces/users.interface';

import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<Users[]> {
        const result = await this.usersService.findAll();
        console.log("result : ", result)
        return result;
    }

    @Get(':id')
    async findOne(@Param('id') params: string): Promise<Users> {
        // console.log("params : ", params);
        const result = this.usersService.findOne(params);
        return result;
    }

    @Post()
    async createUser(@Body() newUser: CreateUserDto): Promise<Users> {
        // console.error("new user : ", newUser);
        const result = await this.usersService.createUser(newUser);
        return result;
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() updateUser: CreateUserDto)
    : Promise<Users> {
        // console.error("update user id: ", id);
        // console.error("update user body: ", updateUser);
        const result = await this.usersService.updateUser(id, updateUser);
        return result;
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<HttpStatus> {
        await this.usersService.deleteUser(id);
        // const result = await this.usersService.deleteUser(id);
        return HttpStatus.NO_CONTENT; // 204
    }
}
