import { Controller, Get, Post, Body, Put, Param, Delete, UseFilters } from '@nestjs/common';
import { RegisterUserDto, ConfirmUserRegistrationDto, ConfirmUserRegistrationAdminDto, UserOwnInfoDto, ConfirmUserDto } from './interfaces/user.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { APIHttpExceptionFilter } from '../http-exception.filter';

@Controller('users')
@UseFilters(new APIHttpExceptionFilter())  // Nice error handling
export class UserController {

    constructor(private readonly userService: UserService) {}

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

    // Email token has been mailed to user.pendingEmail
    @Post('confirm-email')
    @ApiOkResponse({
        description: "Email confirmed"
    })    
    @ApiOperation({summary: "Confirm user registration with a verification email token"})
    confirmEmail(@Body() data: ConfirmUserRegistrationDto) {
        throw new Error("Not implemented");
    }        

    @Post('confirm-email-admin')
    @ApiOkResponse()
    @ApiOperation({summary: "Integration test shortcut to confirm registered users"})
    async confirmEmailAdmin(@Body() data: ConfirmUserRegistrationAdminDto): Promise<ConfirmUserDto> {
        let u = await this.userService.confirmEmailAdmin(data.email)
        return {
            email: u.confirmedEmail  // Emails get lowercased 
        }
    }            
}

