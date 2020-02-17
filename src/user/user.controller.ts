import { Controller, Get, Post, Body, Put, Param, Delete, UseFilters } from '@nestjs/common';
import { RegisterUserDto, ConfirmUserRegistrationDto, ConfirmUserRegistrationAdminDto, UserOwnInfoDto } from './interfaces/user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { APIHttpExceptionFilter } from '../http-exception.filter';

@Controller('users')
@UseFilters(new APIHttpExceptionFilter())  // Nice error handling
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
    async register(@Body() data: RegisterUserDto): Promise<UserOwnInfoDto> {
        const u = await this.userService.register(data.email, data.displayName);                
        return {
            email: u.pendingEmail,  // Emails get lowercased 
            displayName: u.displayName,
            publicId: u.publicId
        }
    }    

    // Called after user clikcks a link in the confirmatino email
    @Post('confirm-email')
    @ApiOkResponse({
        description: "Email confirmed"
    })    
    @ApiOperation({summary: "Confirm user registration with a verification email token"})
    confirmEmail(@Body() data: ConfirmUserRegistrationDto) {
        this.userService.confirmEmail(data.email, data.token);        
    }        

    // 
    @Post('confirm-email-admin')
    @ApiOkResponse({
        description: "Email confirmed"
    })
    @ApiOperation({summary: "Integration test shortcut to confirm registered users"})
    async confirmEmailAdmin(@Body() data: ConfirmUserRegistrationAdminDto) {
        await this.userService.confirmEmailAdmin(data.email);        
    }            
}

