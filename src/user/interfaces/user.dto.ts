/**
 * What users themselves get back from the API
 */

 import { ApiProperty } from '@nestjs/swagger';

export class UserOwnInfoDto {
    readonly displayName: string;
    readonly email: string;
    readonly publidId: string;    
}

export class RegisterUserDto {
    email: string;
    displayName: string;
}
