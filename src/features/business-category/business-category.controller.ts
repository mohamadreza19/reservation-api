import { Controller, Get } from '@nestjs/common';
import { BusinessCategoryService } from './business-category.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('BusinessCategory')
@Controller('business-category')
export class BusinessCategoryController {
  constructor(
    private readonly businessCategoryService: BusinessCategoryService,
  ) {}

  @Get()
  async getAllBusinessCategoryService() {
    return this.businessCategoryService.getAllBusinessCategory();
  }
}
