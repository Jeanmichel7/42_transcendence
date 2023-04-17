import { IsOptional, IsString, Length } from 'class-validator';

export class ChatCreateRoomDTO {
  @IsOptional()
  @IsString()
  @Length(1)
  password: string;
}
