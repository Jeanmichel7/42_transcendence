import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'The login must be between 3 and 20 characters' })
  readonly login: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, {
    message: 'The password must be between 8 and 20 characters',
  })
  readonly password: string;
}
