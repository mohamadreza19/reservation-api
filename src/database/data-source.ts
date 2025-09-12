import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [join(__dirname, '..', '**', '*.entity.ts')],
  migrations: [join(__dirname, '..', '**', 'migrations', '*.ts')],
});
