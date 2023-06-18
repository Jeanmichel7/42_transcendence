export interface UserStatusInterface {
  id: bigint;
  status: 'online' | 'offline' | 'absent';
  login?: string;
  avatar?: string;
  updatedAt?: Date;
}
