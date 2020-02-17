import { Controller, Get, Post, Body, Put, Param, Delete, UseFilters } from '@nestjs/common';
import { RegisterUserDto, ConfirmUserRegistrationDto, ConfirmUserRegistrationAdminDto, UserOwnInfoDto } from './interfaces/user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { APIHttpExceptionFilter } from 'src/http-exception.filter';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    getUsers() {
        return 'we get all dogs';
    }    

    @Post('register')
    @ApiOperation({summary: "Register a new user"})
    @ApiCreatedResponse({
        description: 'The record has been successfully created.',
        type: UserOwnInfoDto
      })    
    @UseFilters(new APIHttpExceptionFilter())  
    async register(@Body() data: RegisterUserDto): Promise<UserOwnInfoDto> {
        const u = await this.userService.register(data.email, data.displayName);        
        return new Promise<UserOwnInfoDto>(resolve => {
            return {
                email: u.pendingEmail,  // Emails get lowercased 
                displayName: u.displayName,
                publicId: u.publicId
            }
        });   
    }    

    // Called after user clikcks a link in the confirmatino email
    @Post('confirm-email')
    @ApiOperation({summary: "Confirm user registration with a verification email token"})
    confirmEmail(@Body() data: ConfirmUserRegistrationDto) {
        this.userService.confirmEmail(data.email, data.token);        
    }        

    // 
    @Post('confirm-email-admin')
    @ApiOperation({summary: "Integration test shortcut to confirm registered users"})
    confirmEmailAdmin(@Body() data: ConfirmUserRegistrationAdminDto) {
        this.userService.confirmEmailAdmin(data.email);        
    }            
}

