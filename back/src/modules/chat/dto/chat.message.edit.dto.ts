import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChatEditMsgDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 2048)
  text: string;
}
