import { Test, TestingModule } from '@nestjs/testing';
import { BusinessServiceService } from './business-service.service';

describe('BusinessServiceService', () => {
  let service: BusinessServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessServiceService],
    }).compile();

    service = module.get<BusinessServiceService>(BusinessServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
