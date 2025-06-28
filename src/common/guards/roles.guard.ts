import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied');
    }
    // console.log(requiredRoles);
    // console.log(user);
    // if(requiredRoles.includes(user.role)){}

    const hasRole = requiredRoles.some((role) => user.role === role);

    // Additional business-specific checks
    // if (user.role === Role.EMPLOYEE || user.role === Role.BUSINESS_ADMIN) {
    //   const businessId = context.switchToHttp().getRequest().params.businessId;
    //   if (businessId && user.business?.id !== businessId) {
    //     throw new ForbiddenException('Not authorized for this business');
    //   }
    // }

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
