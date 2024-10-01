// shared/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../types/user-role.enum'; // Adjust path as needed

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
