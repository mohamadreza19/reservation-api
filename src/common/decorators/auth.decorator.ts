import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '../enums/role.enum';

export function AuthWithRoles(roles: Role[]) {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles(Role.SUPER_ADMIN, ...roles),
  );
}
