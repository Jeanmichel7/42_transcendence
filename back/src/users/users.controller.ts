import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './interfaces/users.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Users[] {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') params: string): Users {
        console.log("params : ", params);
        return this.usersService.findOne(params);
    }

    @Post()
    createUser(@Body() newUser: CreateUserDto): void {
        console.error("new user : ", newUser);
        this.usersService.createUser(newUser);
    }

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() updateUser: CreateUserDto) {
        console.error("update user : ", updateUser);
        return this.usersService.updateUser(id, updateUser);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }
}

