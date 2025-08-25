import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../enums/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    // if (!user || !user.role) {
    //   throw new ForbiddenException('Authentication required');
    // }

    // Get user's permissions based on role
    // const userPermissions = rolePermissions[user.role as Role] || [];

    // Check if user has all required permissions
    // const hasAllPermissions = requiredPermissions.every((permission) =>
    //   userPermissions.includes(permission),
    // );

    // if (!hasAllPermissions) {
    //   throw new ForbiddenException('Insufficient permissions');
    // }

    // Additional business-specific checks
    // if (user.businessId) {
    //   const businessId = request.params.businessId;
    //   if (businessId && user.businessId !== businessId) {
    //     throw new ForbiddenException('Not authorized for this business');
    //   }
    // }

    return true;
  }
}
