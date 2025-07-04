// common/interfaces/query-options.interface.ts

import { User } from 'src/user/entities/user.entity';

export interface QueryOptions {
  page?: number; // Current page number (default 1)
  limit?: number; // Items per page (default 10)
  sort?: string; // Sorting string, e.g., "createdAt:DESC,name:ASC"
  filters?: Record<string, any>; // Key-value pairs for filtering, dynamic
  relations?: string[]; // Array of relations to load
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
export interface FindByUserAccess<Entity = any> {
  findByUserAccess: (id: string, user: User) => Promise<Entity | null>;
}
export interface Update<Entity = any> {
  update: (
    entities: DeepPartial<Entity>,
  ) => Promise<DeepPartial<Entity> & Entity>;
}

export interface FindOneById<Entity = any> {
  findOneById: (id: string) => Promise<Entity | null>;
}

export class FileModuleDependencyService
  implements FindByUserAccess, Update, FindOneById
{
  findByUserAccess: (id: string, user: User) => Promise<any>;
  update: (entities: DeepPartial<any>) => Promise<DeepPartial<any> & any>;
  findOneById: (id: string) => Promise<any>;
}
