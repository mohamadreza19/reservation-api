import { BusinessSchedule } from 'src/features/business/business-schedule/entities/business-schedule.entity';
import { Business } from 'src/features/business/entities/business.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBusinessScheduleForExistingBusinesses1727973052921
  implements MigrationInterface
{
  name = 'CreateBusinessScheduleForExistingBusinesses1727973052921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get all businesses that have null businessScheduleId
    const businesses = await queryRunner.manager.find(Business, {
      where: { businessSchedule: null },
    });

    for (const business of businesses) {
      // Create a default BusinessSchedule for each business
      const businessSchedule = new BusinessSchedule();
      businessSchedule.startHour = '09:00'; // default start time
      businessSchedule.endHour = '17:00'; // default end time
      businessSchedule.timeInterval = 30; // default interval
      businessSchedule.holidays = [6]; // default to Sunday as holiday

      // Save the new BusinessSchedule
      await queryRunner.manager.save(BusinessSchedule, businessSchedule);

      // Associate the Business with the new BusinessSchedule
      business.businessSchedule = businessSchedule;

      // Save the updated Business entity
      await queryRunner.manager.save(Business, business);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This down migration would depend on how you'd want to revert the changes.
    // It might not be necessary to remove BusinessSchedules, but you can implement logic here if needed.
  }
}
