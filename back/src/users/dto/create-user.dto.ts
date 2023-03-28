import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    // @IsNotEmpty()
    // readonly id: number;

    @IsNotEmpty()
    @MinLength(3)
    readonly firstName: string;
    
    @IsNotEmpty()
    @MinLength(3)
    readonly lastName:string;
    
    @IsNotEmpty()
    @MinLength(3)
    readonly pseudo:string;
    
    @IsNotEmpty()
    @IsEmail()
    readonly email:string;
    
    @IsNotEmpty()
    @MinLength(8)
    readonly password:string;
    
    @IsBoolean()
    readonly is_admin?:boolean;

    readonly avatar?:string;
    
    readonly description?:string;
}