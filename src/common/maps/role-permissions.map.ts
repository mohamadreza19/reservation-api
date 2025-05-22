import { Role } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';

type RolePermissionMap = {
  [key in Role]: Permission[];
};

export const rolePermissions: RolePermissionMap = {
  [Role.SUPER_ADMIN]: [
    Permission.MANAGE_USERS,
    Permission.MANAGE_BUSINESS,
    Permission.MANAGE_EMPLOYEES,
    Permission.MANAGE_APPOINTMENTS,
    Permission.MANAGE_SERVICES,
    // ... all permissions
  ],
  [Role.BUSINESS_ADMIN]: [
    Permission.MANAGE_OWN_PROFILE,
    Permission.MANAGE_EMPLOYEES,
    Permission.VIEW_BUSINESS,
    Permission.MANAGE_APPOINTMENTS,
    Permission.VIEW_APPOINTMENTS,
    Permission.MANAGE_SERVICES,
    Permission.VIEW_SERVICES,
  ],
  [Role.EMPLOYEE]: [
    Permission.MANAGE_OWN_PROFILE,
    Permission.VIEW_APPOINTMENTS,
    Permission.MANAGE_OWN_APPOINTMENTS,
    Permission.VIEW_SERVICES,
  ],
  [Role.CUSTOMER]: [
    Permission.MANAGE_OWN_PROFILE,
    Permission.VIEW_APPOINTMENTS,
    Permission.MANAGE_OWN_APPOINTMENTS,
    Permission.VIEW_SERVICES,
  ],
  //   [Role.GUEST]: [],
};
