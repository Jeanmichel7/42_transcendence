export interface UserStatusInterface {
  id: bigint;
  status: 'online' | 'offline' | 'absent' | 'in game' | 'inactive';
  login?: string;
  avatar?: string;
  updatedAt?: Date;
}
