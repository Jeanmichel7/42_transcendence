import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ChatCreateRoomDTO {
  @IsOptional()
  @IsString()
  @Length(1)
  password: string;

  @IsNotEmpty()
  @IsString()
  type: 'public' | 'protected';

  @IsNotEmpty()
  @IsString()
  @Length(1)
  name: string;
}
