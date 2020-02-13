import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { RegisterUserDto } from './interfaces/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    getUsers() {
        return 'we get all dogs';
    }    

    @Post()
    register(@Body() data: RegisterUserDto) {
        const u = this.userService.register(data.email, data.displayName);
    }    
}
