import { TrophyInterface, TrophyProgressInterface } from './TrophiesTypes';

export interface UserInterface {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'online' | 'offline' | 'absent' | 'in game' | 'inactive';
  avatar: string;
  score: number;
  level: number;
  description?: string;
  role?: 'user' | 'admin';
  is2FAEnabled?: boolean;
  friends?: UserInterface[];
  userBlocked?: UserInterface[];
  waitingFriendsRequestReceived?: UserInterface[];
  waitingFriendsRequestSent?: UserInterface[];
  trophies?: TrophyInterface[];
  trophiesProgress?: TrophyProgressInterface[];
  // level?: number;
  experience?: number;
  rank?: string;
}

export interface UserRelation {
  id: number;
  // userId: bigint,
  relationType: string;
  createdAt: Date;
  updatedAt: Date;
  userRelation: UserInterface;
}
