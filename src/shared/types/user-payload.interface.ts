import { UserRole } from './user-role.enum';

export interface UserPayload {
  userId: number;

  role: UserRole;
}
