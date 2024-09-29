import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCategoryController } from './service-category.controller';
import { ServiceCategoryService } from './service-category.service';

describe('ServiceCategoryController', () => {
  let controller: ServiceCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceCategoryController],
      providers: [ServiceCategoryService],
    }).compile();

    controller = module.get<ServiceCategoryController>(ServiceCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
