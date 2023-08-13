import { UserInterface } from './UserTypes';

export interface TrophyInterface {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  isHeld: boolean;
  progress: number;
  total: number;
}

export interface TrophyProgressInterface {
  id: number;
  progress: number;
  total: number;
  trophy: TrophyInterface;
  user: UserInterface;
}
