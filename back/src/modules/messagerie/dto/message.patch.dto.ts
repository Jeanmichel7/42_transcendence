import { IsNotEmpty, IsString, Length, } from "class-validator";

export class MessagePatchDTO {
    @IsNotEmpty()
    @IsString()
    @Length(1)
    text:string;
}