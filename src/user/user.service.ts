import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {}    

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }        

    async register(email, displayName) {
        const u = new User();
        u.displayName = displayName;
        u.pendingEmail = email;
        await this.userRepository.save(u);
    }
            
}
