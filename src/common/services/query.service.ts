import { Injectable } from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  FindOptionsOrder,
  ObjectLiteral,
} from 'typeorm';
import { PaginatedResult, QueryOptions } from '../interfaces/model';

@Injectable()
export class QueryService<T extends ObjectLiteral> {
  constructor(private readonly repo: Repository<T>) {}

  async findAll(
    options: QueryOptions,
    customWhere?: (filters: Record<string, any>) => FindOptionsWhere<T>,
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sort, filters = {}, relations } = options;

    const skip = (page - 1) * limit;

    const where = customWhere
      ? customWhere(filters)
      : (filters as FindOptionsWhere<T>);

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

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
