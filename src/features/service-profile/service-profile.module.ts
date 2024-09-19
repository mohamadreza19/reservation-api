import { Module } from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { ServiceProfileController } from './service-profile.controller';

import { AvailableTimeModule } from './available-time/available-time.module';

@Module({
  controllers: [ServiceProfileController],
  providers: [ServiceProfileService],
  imports: [AvailableTimeModule],
})
export class ServiceProfileModule {}
