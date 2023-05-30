import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ChatUpdateRoomDTO {
  @IsOptional()
  @IsString()
  @Length(1)
  password: string;

  @IsOptional()
  @IsBoolean()
  isProtected: boolean;

  @IsOptional()
  @IsString()
  type: 'public' | 'private';

  @IsOptional()
  @IsString()
  @Length(1)
  name: string;

  @IsOptional()
  @IsArray()
  @Length(1)
  acceptedUsers: string[];
}
