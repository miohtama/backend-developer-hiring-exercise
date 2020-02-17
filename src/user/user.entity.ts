import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {IsEmail, IsOptional} from "class-validator";



// user is a reserved name in PostgreSQL
@Entity("site_user")
export class User {

    static EMAIL_CONFIRMATION_TIMEOUT_SECONDS = 3*24*3600;

   // This is what we use internally as a foreign key, but never expose to the public because leaking user counts is 
   // a company trade secrets issue 
   // (Running counter keys make data more local and faster to access) 
   @PrimaryGeneratedColumn()
   id: number;

   // Nice columns for internal statistics and diagnostics
   // We assume all servers tick UTC, but we always preserve timezone for 
   // our sanity when something gets messy   
   @CreateDateColumn({ type: 'timestamptz', name: 'create_date', default: () => 'LOCALTIMESTAMP' })
   createdAt: Date;
   
   // Nice columns for internal statistics and diagnostics
   @UpdateDateColumn({ type: 'timestamptz', name: 'update_date', default: () => 'LOCALTIMESTAMP' })
   updatedAt: Date;
 
   // Already refer users by this id when in the APIs .
   // (Randomized public ids make data exposure safer)
   @Column({unique: true})
   @Generated("uuid")
   publicId: string;   

   // User's chosen nick, settable by the user
   @Column({length: 50, unique: true})
   displayName: string;

   // Set after the email verification completes
   @Column({length: 50, nullable: true, unique: true})
   @IsOptional()
   @IsEmail()
   confirmedEmail: string;

   // Set on the sign up / email change
   @Column({length: 50, nullable: false})
   @IsEmail()
   pendingEmail: string;

   // Set after the email verification completes
   @Column({length: 16, nullable: true, unique: true})
   emailConfirmationToken: string;

    // When the user registerd / requested email change
    @Column({ type: 'timestamptz', nullable: false })
    emailConfirmationRequestedAt: Date;

    // When the user registerd / requested email change
    @Column({ type: 'timestamptz', nullable: true})
    emailConfirmationCompletedAt: Date;
    
    // TODO: Phone number field

    // We ignore the password field in the context of this exercise,
    // as asking a truly safe password management routines 
    // from the candidates would be overkill.
    // But please read here: https://github.com/miohtama/opsec/blob/master/source/user/effective-session-kill.rst

    // Can this user login - the email registratoin is valid
    canLogIn(): boolean { 
        return this.emailConfirmationCompletedAt != null;
    }

}