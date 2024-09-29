import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  businessCategoryId: number;
}
