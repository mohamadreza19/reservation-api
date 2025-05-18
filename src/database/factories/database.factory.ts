import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntitySchema, MixedList } from 'typeorm';

export function createDatabaseConfig(
  url: string,
  entities?: MixedList<string | Function | EntitySchema<any>> | undefined,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url: url,
    entities: entities,
    ssl: {
      rejectUnauthorized: false, // Needed for Render
    },

    autoLoadEntities: true,
    synchronize: true, // Use migrations instead in production
  };
}
