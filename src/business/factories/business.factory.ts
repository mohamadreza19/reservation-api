import { setSeederFactory } from 'typeorm-extension';
import { Business } from '../../business/entities/business.entity';
import { faker } from '@faker-js/faker';

export default setSeederFactory(Business, () => {
  const business = new Business();
  business.name = faker.company.name();
  business.address = faker.address.streetAddress();
  business.phone = faker.phone.number();
  return business;
});
