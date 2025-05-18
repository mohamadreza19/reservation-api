import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Business } from '../../business/entities/business.entity';

export default class BusinessSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    const repo = dataSource.getRepository(Business);

    await repo.insert([
      {
        name: 'Acme Corp',
        address: '123 Main St',
        phone: '123-456-7890',
      },
      {
        name: 'Globex Inc.',
        address: '456 Elm St',
        phone: '987-654-3210',
      },
    ]);
  }
}
