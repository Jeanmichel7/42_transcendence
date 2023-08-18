import { UserInterface } from 'src/modules/users/interfaces/users.interface';

export interface AuthInterface {
  accessToken: string;
  user: UserInterface;
}
