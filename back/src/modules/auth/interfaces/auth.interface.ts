import { UserInterface } from 'src/modules/users/interfaces/users.interface';

export interface AuthInterface {
  accessToken: string;
  user: UserInterface;
}

// export interface Auth2faInterface {
//     access_token: string;
//     secret2FA: string;
//     user: UserInterface;
// }
