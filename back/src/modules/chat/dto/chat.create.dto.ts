import { IsNotEmpty, IsString, Length, } from "class-validator";

export class ChatCreateMsgDTO {
    @IsNotEmpty()
    @IsString()
    @Length(1)
    text:string;
}