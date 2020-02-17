import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {Validator} from "class-validator";
import { strict as assert } from 'assert';
import { APISafeException } from '../apiexception';


class UserExists extends APISafeException {    
}    

class ConfirmationEmailExpiredError extends APISafeException {
}    

class ConfirmationEmailWrongToken extends APISafeException {
}    


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {}    

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }        

    async register(email: string, displayName: string): Promise<User> {
        
        email = email.toLowerCase();
        
        let existing = this.userRepository.findOne({confirmedEmail: email});
        if(existing) {
            throw new UserExists(`The user with email ${email} exists`)
        }

        existing = this.userRepository.findOne({displayName});
        if(existing) {
            throw new UserExists(`The user with name ${displayName} exists`)
        }
        
        const u = new User();
        u.displayName = displayName;
        u.pendingEmail = email;
        u.emailConfirmationRequestedAt = new Date();

        // We do not have any email out integration in this execrise

        await this.userRepository.save(u);
        return u;
    }

    // Make user to confirm their account on registration
    async confirmEmail(email: string, token: string, now_:Date = null) {

        const validator = new Validator();
        email = email.toLowerCase();

        assert(validator.isEmail(email));

        // Allow override time for testing
        if(!now_) {
            now_ = new Date();
        }
                
        const existing = this.userRepository.findOneOrFail({confirmedEmail: email});
        if(existing) {
            throw new UserExists(`The user with email ${email} exists`)
        }

        const record = await this.userRepository.findOneOrFail({pendingEmail: email})

        // Shitscript is shit, standard datetime sucks and no arithmetic methods
        if(now_ > new Date(record.emailConfirmationRequestedAt.getTime() + User.EMAIL_CONFIRMATION_TIMEOUT_SECONDS)) {
            throw new ConfirmationEmailExpiredError("Confirmation email was expired.");
        }

        if(token != record.emailConfirmationToken) {
            throw new ConfirmationEmailWrongToken("Invalid confirmation.");
        }

        record.confirmedEmail = record.pendingEmail;
        record.emailConfirmationCompletedAt = now_;
        record.emailConfirmationToken = null; 

        this.userRepository.save(record);

    }

    /**
     * Shortcut method to confirm email addresses without a good token.
     * Use in testing - does not do error checking.
     * 
     */
    async confirmEmailAdmin(email: string, now_:Date = null) {

        // Allow override time for testing
        if(!now_) {
            now_ = new Date();
        }        

        const record = await this.userRepository.findOneOrFail({pendingEmail: email})
        record.confirmedEmail = record.pendingEmail;
        record.emailConfirmationCompletedAt = now_;
        record.emailConfirmationToken = null; 

        this.userRepository.save(record);
    }    
            
}
