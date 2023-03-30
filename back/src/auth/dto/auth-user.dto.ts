import { IsNotEmpty, IsString, Length } from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 20, {message: "The pseudo must be between 3 and 20 characters"})
    readonly pseudo:string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20, {message: "The password must be between 8 and 20 characters"})
    readonly password:string;

}