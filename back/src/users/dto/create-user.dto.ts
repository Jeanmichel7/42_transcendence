import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, Length, IS_STRONG_PASSWORD } from "class-validator";

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
    readonly pseudo:string;

    @IsNotEmpty()
    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    // @IS_STRONG_PASSWORD()
    @MinLength(8)
    readonly password:string;

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