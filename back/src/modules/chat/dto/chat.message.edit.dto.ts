import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChatEditMsgDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 65000)
  text: string;
}
