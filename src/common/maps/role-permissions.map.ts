import { Role } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';

type RolePermissionMap = {
  [key in Role]: Permission[];
};
