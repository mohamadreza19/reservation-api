import { Test, TestingModule } from '@nestjs/testing';
import { BusinessCategoryService } from './business-category.service';

describe('BusinessCategoryService', () => {
  let service: BusinessCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessCategoryService],
    }).compile();

    service = module.get<BusinessCategoryService>(BusinessCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
