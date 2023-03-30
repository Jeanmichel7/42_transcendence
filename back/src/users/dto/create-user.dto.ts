import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, Length, IsStrongPassword } from "class-validator";
import { Unique } from "typeorm";

export class CreateUserDto {
    @IsOptional()
    @IsNotEmpty()
    readonly id?: bigint;

    @IsNotEmpty({message : "The first name is required"})
    @Length(3, 20, {message: "The first name must be between 3 and 20 characters"})
    readonly firstName: string;

    @IsNotEmpty({message: "The last name is required"})
    @Length(3,20, {message: "The last name must be between 3 and 20 characters"})
    readonly lastName:string;

    @IsNotEmpty({message: "The pseudo is required"})
    @Length(3, 20, {message: "The pseudo must be between 3 and 20 characters"})
    // @Unique("", [],{message: "The pseudo is already taken"})
    readonly pseudo:string;

    @IsNotEmpty()
    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    @MinLength(8)
    @IsStrongPassword(
        {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, },
        {message: "The password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number and one symbol."}
    )
    password:string;

    @IsOptional()
    @IsBoolean()
    readonly is_admin?:boolean;
    
    @IsOptional()
    @IsString()
    readonly avatar?:string;

    @IsOptional()
    @IsString()
    readonly description?:string;
}