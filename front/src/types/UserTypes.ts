
export interface UserInterface {
  id: number;
  login: string,
  email: string,
  firstName: string,
  lastName: string,
  status: 'online' | 'offline' | 'absent' | 'in game',
  avatar: string,
  description: string,
  friends?: UserInterface[],
  userBlocked?: UserInterface[],
  role?: 'user' | 'admin',
  is2FAEnabled: boolean,
}
