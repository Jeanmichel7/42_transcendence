import { Request } from 'express';
import { UserInterface } from 'src/modules/users/interfaces/users.interface';

export interface RequestWithUser extends Request {
  user: UserInterface;
}
