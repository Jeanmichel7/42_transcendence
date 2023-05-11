import { IsOptional, IsString, Length } from 'class-validator';

export class ChatUpdateRoomDTO {
  @IsOptional()
  @IsString()
  @Length(1)
  password: string;

  @IsOptional()
  @IsString()
  type: 'public' | 'protected';
}
