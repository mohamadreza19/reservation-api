import { Test, TestingModule } from '@nestjs/testing';
import { BusinessScheduleService } from './business-schedule.service';

describe('BusinessScheduleService', () => {
  let service: BusinessScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessScheduleService],
    }).compile();

    service = module.get<BusinessScheduleService>(BusinessScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
