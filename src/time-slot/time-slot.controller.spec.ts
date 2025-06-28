import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';

describe('TimeSlotController', () => {
  let controller: TimeSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSlotController],
      providers: [TimeSlotService],
    }).compile();

    controller = module.get<TimeSlotController>(TimeSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
