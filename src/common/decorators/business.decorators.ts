import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthWithRoles } from './auth.decorator';
import { Role } from '../enums/role.enum';
import { User } from 'src/user/entities/user.entity';

export function ApiBusinessOperation({
  summary,
  roles,
}: {
  summary: string;
  roles?: Role[];
}) {
  const decorators: any[] = [
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: `${summary} successfully` }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
  ];

  if (roles) {
    decorators.push(AuthWithRoles(roles));
  }

  return applyDecorators(...decorators);
}

export function ApiQueryParams() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number for pagination',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of items per page',
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      type: String,
      description: 'Sort field and order (e.g., address:asc)',
    }),
    ApiQuery({
      name: 'address',
      required: false,
      type: String,
      description: 'Filter by address',
    }),
    ApiQuery({
      name: 'userId',
      required: false,
      type: String,
      description: 'Filter by user ID',
    }),
    ApiQuery({
      name: 'fields',
      required: false,
      type: String,
      description:
        'Comma-separated fields to select (e.g., id,address,userInfo.id,services.id)',
    }),
  );
}

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
