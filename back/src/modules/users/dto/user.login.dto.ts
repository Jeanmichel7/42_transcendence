import {
  IsNotEmpty,
  MinLength,
  Length,
  IsStrongPassword,
} from 'class-validator';

export class UserLoginDTO {
  @IsNotEmpty({ message: 'The login is required' })
  @Length(2, 22, { message: 'The login must be between 2 and 22 characters' })
  readonly login: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'The password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number and one symbol.',
    },
  )
  password: string;
}
