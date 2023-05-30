import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ChatCreateRoomDTO {
  @IsOptional()
  @IsString()
  @Length(1)
  password: string;

  @IsOptional()
  @IsBoolean()
  isProtected: boolean;

  @IsNotEmpty()
  @IsString()
  type: 'public' | 'private';

  @IsNotEmpty()
  @IsString()
  @Length(1)
  name: string;

  @IsOptional()
  @IsArray()
  @Length(1)
  acceptedUsers: string[];
}
