import { TrophiesEntity } from 'src/modules/trophies/entity/trophies.entity';

export interface ProfilInterface {
  id: bigint;
  firstName: string;
  lastName: string;
  login: string;
  email: string;
  status: 'online' | 'offline' | 'absent' | 'in game' | 'inactive';
  description?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  trophies?: TrophiesEntity[];
}
