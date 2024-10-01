import { Test, TestingModule } from '@nestjs/testing';
import { BusinessScheduleController } from './business-schedule.controller';
import { BusinessScheduleService } from './business-schedule.service';

describe('BusinessScheduleController', () => {
  let controller: BusinessScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessScheduleController],
      providers: [BusinessScheduleService],
    }).compile();

    controller = module.get<BusinessScheduleController>(BusinessScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
