// common/interfaces/query-options.interface.ts

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
