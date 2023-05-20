import { IsOptional, IsString, Length } from 'class-validator';

export class ChatJoinRoomDTO {
  @IsOptional()
  @IsString()
  @Length(1)
  password: string;
}
