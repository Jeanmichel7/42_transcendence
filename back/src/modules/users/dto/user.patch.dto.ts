import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  MinLength,
  IsStrongPassword,
  IsEmail,
  Max,
} from 'class-validator';

export class UserPatchDTO {
  @IsOptional()
  @IsNotEmpty({ message: 'The first name is required' })
  @Length(2, 22, {
    message: 'The first name must be between 2 and 22 characters',
  })
  firstName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'The last name is required' })
  @Length(2, 22, {
    message: 'The last name must be between 2 and 22 characters',
  })
  lastName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'The login is required' })
  @Length(2, 22, { message: 'The login must be between 2 and 22 characters' })
  login: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
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

  @IsOptional()
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
  oldPassword: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(1, 256, {
    message: 'The description must be between 1 and 256 characters',
  })
  description?: string;
}
