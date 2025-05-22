// src/types/express.d.ts
import { Role } from '../auth/enums/role.enum';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        phoneNumber: string;
        role: Role;
        businessId?: string;
      };
    }
  }
}
