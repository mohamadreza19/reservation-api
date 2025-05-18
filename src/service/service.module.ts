import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { SubService } from './entities/sub-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, SubService])],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
