import { Test, TestingModule } from '@nestjs/testing';
import { BusinessServiceController } from './business-service.controller';
import { BusinessServiceService } from './business-service.service';

describe('BusinessServiceController', () => {
  let controller: BusinessServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessServiceController],
      providers: [BusinessServiceService],
    }).compile();

    controller = module.get<BusinessServiceController>(BusinessServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
