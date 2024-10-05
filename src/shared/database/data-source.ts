import { config } from 'dotenv';
import { DataSource } from 'typeorm';
// other entities...

config(); // load .env file

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // Load DB URL from env
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'], // Specify entity paths
  synchronize: false, // Don't use in production, prefer migrations
  migrations: [__dirname + '/migrations/*.ts'], // Specify migration folder
  ssl: {
    rejectUnauthorized: false, // Adjust this as per your needs
  },
});
