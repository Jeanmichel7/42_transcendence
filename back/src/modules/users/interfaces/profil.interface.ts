export interface ProfilInterface {
  id: bigint;
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  status: string;
  description?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
