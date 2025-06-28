import { Test, TestingModule } from '@nestjs/testing';
import { SwaggerController } from './swagger.controller';
import { SwaggerService } from './swagger.service';

describe('SwaggerController', () => {
  let controller: SwaggerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwaggerController],
      providers: [SwaggerService],
    }).compile();

    controller = module.get<SwaggerController>(SwaggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
