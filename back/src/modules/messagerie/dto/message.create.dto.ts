import { IsNotEmpty, IsString, Length } from 'class-validator';

export class MessageCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1)
  text: string;
}
