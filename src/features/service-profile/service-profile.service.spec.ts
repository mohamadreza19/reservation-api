import { Test, TestingModule } from '@nestjs/testing';
import { ServiceProfileService } from './service-profile.service';

describe('ServiceProfileService', () => {
  let service: ServiceProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceProfileService],
    }).compile();

    service = module.get<ServiceProfileService>(ServiceProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
