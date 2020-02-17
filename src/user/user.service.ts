import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import {Validator, validateOrReject} from "class-validator";
import { strict as assert } from 'assert';
import { APISafeException, ValidationAPIException } from '../apiexception';


// Some common error conditions
class UserExists extends APISafeException {    
}    

class ConfirmationEmailExpiredError extends APISafeException {
}    

class ConfirmationEmailWrongToken extends APISafeException {
}

class AlreadyConfirmedEmail extends APISafeException {
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
        
        let existing = await this.userRepository.findOne({confirmedEmail: email});        
        if(existing) {
            throw new UserExists(`The user with email ${email} exists`)
        }

        existing = await this.userRepository.findOne({displayName});
        if(existing) {
            throw new UserExists(`The user with name ${displayName} exists`)
        }
        
        const u = new User();
        u.displayName = displayName;
        u.pendingEmail = email;
        u.emailConfirmationRequestedAt = new Date();
        // https://stackoverflow.com/a/47496558/315168
        u.emailConfirmationToken = [...Array(16)].map(() => Math.random().toString(36)[2]).join(''); // TODO: Add a crypto secure user reasdable random token

        // Run application level validators like IsEmail()
        try {
            await validateOrReject(u);
        } catch(e) {
            // Convert to friendlier exception
            throw ValidationAPIException.createFromValidationOutput(e);
        }
        
        // We do not have any email out integration in this execrise        
        await this.userRepository.save(u);
        return u;
    }

    /**
     * Check if the confirmed email alreaddy is there
     */
    async checkConfirmedEmail(email: string) { 
        const existing = await this.userRepository.findOne({confirmedEmail: email});
        if(existing) {
            throw new AlreadyConfirmedEmail(`The user with email ${email} is already confirmed`)
        }
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
                
        await this.checkConfirmedEmail(email);

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

        // Run application level validators like IsEmail()
        try {
            await validateOrReject(record);
        } catch(e) {
            // Convert to friendlier exception
            throw ValidationAPIException.createFromValidationOutput(e);
        }              

        this.userRepository.save(record);

    }

    /**
     * Shortcut method to confirm email addresses without a good token.
     * Use in testing - does not do error checking.
     * 
     */
    async confirmEmailAdmin(email: string, now_:Date = null): Promise<User> {

        // Allow override time for testing
        if(!now_) {
            now_ = new Date();
        }        

        await this.checkConfirmedEmail(email);

        const record = await this.userRepository.findOneOrFail({pendingEmail: email})
        record.confirmedEmail = record.pendingEmail;
        record.emailConfirmationCompletedAt = now_;
        record.emailConfirmationToken = null; 

        // Run application level validators like IsEmail()
        try {
            await validateOrReject(record);
        } catch(e) {
            // Convert to friendlier exception
            throw ValidationAPIException.createFromValidationOutput(e);
        }        

        await this.userRepository.save(record);
        return record;
    }    
            
}
