// common/interfaces/generic-service.interface.ts

import { PaginatedResult, QueryOptions } from './model';

export interface IGenericService<T> {
  findAll(query: QueryOptions): Promise<PaginatedResult<T>>;
}
