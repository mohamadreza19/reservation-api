import { Test, TestingModule } from '@nestjs/testing';
import { ServiceProfileController } from './service-profile.controller';
import { ServiceProfileService } from './service-profile.service';

describe('ServiceProfileController', () => {
  let controller: ServiceProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProfileController],
      providers: [ServiceProfileService],
    }).compile();

    controller = module.get<ServiceProfileController>(ServiceProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
