import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  // @Length(3, 20, {message: "The login must be between 3 and 20 characters"})
  readonly code: string;

  @IsNotEmpty()
  readonly userId: bigint;
}
