import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Business } from '../business/entities/business.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Service } from '../service/entities/service.entity';
import { SubService } from '../service/entities/sub-service.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Reminder } from '../reminder/entities/reminder.entity';
import { generatePersianPhoneNumber } from '../common/utils/generate-persian-phone';

dotenv.config();

async function seed() {
  console.log('Starting seed process...');

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [
      Business,
      Employee,
      Service,
      SubService,
      Appointment,
      Customer,
      Reminder,
    ],
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: false,
    logging: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected');

    const businessRepo = dataSource.getRepository(Business);
    const employeeRepo = dataSource.getRepository(Employee);
    const serviceRepo = dataSource.getRepository(Service);
    const subServiceRepo = dataSource.getRepository(SubService);
    const customerRepo = dataSource.getRepository(Customer);
    const appointmentRepo = dataSource.getRepository(Appointment);
    const reminderRepo = dataSource.getRepository(Reminder);

    // Clear data
    await reminderRepo.delete({});
    await appointmentRepo.delete({});
    await subServiceRepo.delete({});
    await serviceRepo.delete({});
    await employeeRepo.delete({});
    await customerRepo.delete({});
    await businessRepo.delete({});

    // Create a business
    const business = await businessRepo.save({
      name: 'سالن زیبایی لاکچری',
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      phone: generatePersianPhoneNumber(false),
    });

    // Employees
    const employees = await employeeRepo.save(
      Array.from({ length: 3 }).map(() => ({
        fullName: faker.person.fullName(), // ✅ Fix
        specialization: faker.person.jobTitle(), // ✅ Fix
        business,
      })),
    );

    // Services with sub-services
    const services = await Promise.all(
      ['خدمات مو', 'خدمات ناخن', 'ماساژ'].map((serviceName) =>
        serviceRepo.save({
          name: serviceName,
          description: faker.lorem.sentence(),
          business,
        }),
      ),
    );

    const subServices: SubService[] = [];
    for (const service of services) {
      const subs = await subServiceRepo.save([
        {
          name: `${service.name} سطح ۱`,
          price: faker.number.int({ min: 100000, max: 300000 }),
          durationMinutes: 30,
          service,
        },
        {
          name: `${service.name} سطح ۲`,
          price: faker.number.int({ min: 200000, max: 500000 }),
          durationMinutes: 60,
          service,
        },
      ]);
      subServices.push(...subs);
    }

    // Customers
    const customers = await customerRepo.save(
      Array.from({ length: 5 }).map(() => ({
        fullName: faker.person.fullName(),
        phone: generatePersianPhoneNumber(false),
      })),
    );

    // Appointments
    // const appointments: Appointment[] = [];
    // for (let i = 0; i < 10; i++) {
    //   const customer = faker.helpers.arrayElement(customers);
    //   const subService = faker.helpers.arrayElement(subServices);
    //   const employee = faker.helpers.arrayElement(employees);
    //   const date = faker.date.soon({ days: 10 });

    //   const appointment = await appointmentRepo.save({
    //     customer,
    //     subService,
    //     employee,
    //     date,
    //     note: faker.lorem.sentence(),
    //   });

    //   appointments.push(appointment);
    // }

    // Reminders
    // await Promise.all(
    //   appointments.map((appointment) =>
    //     reminderRepo.save({
    //       appointment,
    //       message: `یادآوری برای وقت ${appointment.subService.name}`,
    //       sendAt: new Date(
    //         appointment.date.getTime() - 1000 * 60 * 60 * 2, // 2 hours before
    //       ),
    //     }),
    //   ),
    // );

    console.log('✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('Connection closed');
  }
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
