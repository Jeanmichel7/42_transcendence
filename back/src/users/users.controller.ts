import { Controller, Req, Res, Get, Post, Body, Param, Patch, Put, Delete, HttpStatus, HttpCode, ParseIntPipe, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

// import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { AuthOwnUserGuard } from 'src/auth/guard/authOwnUser.guard';

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
    
    @Public()
    @Post('register')
    @UsePipes(ValidationPipe)
    // @HttpCode(201)
    async createUser(@Body() newUser: CreateUserDto): Promise<User> {
        // console.error("new user : ", newUser);
        const result = await this.usersService.createUser(newUser);
        return result;
    }


    @Get(':id/active2fa')
    @UseGuards(AuthOwnUserGuard)
    async active2fa( @Param('id', ParseIntPipe) userId: bigint ): Promise<User> {
        // console.error("new user : ", newUser);
        const result = await this.usersService.active2fa(userId);
        return result;
    }

    @Get(':id/desactive2fa')
    @UseGuards(AuthOwnUserGuard)
    async desactive2fa( @Param('id', ParseIntPipe) userId: bigint ): Promise<User> {
        // console.error("new user : ", newUser);
        const result = await this.usersService.desactive2fa(userId);
        return result;
    }

    // @Public()
    // @Post('OAuthregister')
    // @UsePipes(ValidationPipe)
    // async createOAuthUser(@)



    @Patch(':id')
    @UseGuards(AuthOwnUserGuard)
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async patchUser(@Param('id', ParseIntPipe) id: bigint, @Body() updateUser: CreateUserDto)
    : Promise<User> {
        // console.error("update user id: ", id);
        // console.error("update user body: ", updateUser);
        const result = await this.usersService.patchUser(id, updateUser);
        return result;
    }

    @Put(':id')
    @UseGuards(AuthOwnUserGuard)
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async updateUser(@Param('id', ParseIntPipe) id: bigint, @Body() updateUser: CreateUserDto)
    : Promise<User> {
        // console.error("update user id: ", id);
        // console.error("update user body: ", updateUser);
        const result = await this.usersService.updateUser(id, updateUser);
        return result;
    }

    @Delete(':id')
    @UseGuards(AuthOwnUserGuard)
    async deleteUser(@Param('id', ParseIntPipe) id: bigint): Promise<HttpStatus> {
        await this.usersService.deleteUser(id);
        return HttpStatus.NO_CONTENT; // 204
    }
}
