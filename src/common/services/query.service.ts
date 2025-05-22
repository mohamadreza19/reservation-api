import { Injectable, Logger } from '@nestjs/common';
import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { PaginatedResult, QueryOptions } from '../models/model';

@Injectable()
export class QueryService<T extends ObjectLiteral> {
  private readonly logger = new Logger(QueryService.name);

  constructor(private readonly repo: Repository<T>) {}

  private defaultCustomWhere(
    filters: Record<string, any>,
  ): FindOptionsWhere<T> {
    // Return filters as-is for simple equality-based filtering
    return filters as FindOptionsWhere<T>;
  }

  async findAll(
    options: QueryOptions,
    customWhere: (filters: Record<string, any>) => FindOptionsWhere<T> = this
      .defaultCustomWhere,
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sort, filters = {}, relations } = options;

    const skip = (page - 1) * limit;
    this.logger.debug(`Filters: ${JSON.stringify(filters)}`);

    const where = customWhere(filters);
    this.logger.debug(`Where clause: ${JSON.stringify(where)}`);

    const order: Record<string, any> = {};

    if (sort) {
      sort.split(',').forEach((s) => {
        const [field, dir] = s.split(':');
        if (field) {
          order[field.trim()] = dir?.toUpperCase() || 'ASC';
        }
      });
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      order,
      skip,
      take: limit,
      relations,
    });

    this.logger.debug(`Found ${total} records`);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }
}
