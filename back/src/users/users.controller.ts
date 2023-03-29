import { Controller, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, HttpCode, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';

//privilégier le typage de l'interace plutôt que de l'entité
import { User } from './interfaces/users.interface';

import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        const result = await this.usersService.findAll();
        // console.log("result : ", result)
        return result;
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) params: bigint): Promise<User> {
        // console.log("params : ", params);
        const result = this.usersService.findOne(params);
        return result;
    }

    @Post()
    @UsePipes(ValidationPipe)
    // @HttpCode(201)
    async createUser(@Body() newUser: CreateUserDto): Promise<User> {
        // console.error("new user : ", newUser);
        const result = await this.usersService.createUser(newUser);
        return result;
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async patchUser(@Param('id', ParseIntPipe) id: bigint, @Body() updateUser: CreateUserDto)
    : Promise<User> {
        // console.error("update user id: ", id);
        // console.error("update user body: ", updateUser);
        const result = await this.usersService.patchUser(id, updateUser);
        return result;
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async updateUser(@Param('id', ParseIntPipe) id: bigint, @Body() updateUser: CreateUserDto)
    : Promise<User> {
        // console.error("update user id: ", id);
        // console.error("update user body: ", updateUser);
        const result = await this.usersService.updateUser(id, updateUser);
        return result;
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: bigint): Promise<HttpStatus> {
        await this.usersService.deleteUser(id);
        return HttpStatus.NO_CONTENT; // 204
    }
}

/*
/users, GET
/users/:id, GET
/users, POST
/users/:id, PATCH
/users/:id, PUT
/users/:id, DELETE

/messages, GET
/messages/user/:id, GET
/messages/user/:userId/:userDestId, POST
/messages/:id, PATCH
/messages/:id, DELETE
*/