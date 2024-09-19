import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { CustomerModule } from './features/customer/customer.module';

import { BusinessModule } from './features/business/business.module';
import { EmployeeModule } from './features/employee/employee.module';
import { BusinessCategory } from './features/business-category/entities/business-category.entity';
import { ServiceCategory } from './features/business-category/entities/service-category.entity';
import { ServiceProfileModule } from './features/service-profile/service-profile.module';

@Module({
  imports: [
    DatabaseModule,
    CustomerModule,
    BusinessModule,
    BusinessCategory,
    ServiceCategory,
    EmployeeModule,
    ServiceProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
