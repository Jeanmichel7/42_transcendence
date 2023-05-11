export interface ProfilInterface {
  id: bigint;
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  status: 'online' | 'offline' | 'absent';
  description?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
