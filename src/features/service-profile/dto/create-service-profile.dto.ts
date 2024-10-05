import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class CreateServiceProfileDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    type: Number,

    isArray: true,
    description: 'Array of employee IDs',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  employeeIds: number[];

  @ApiProperty()
  @IsNumber({})
  @IsPositive()
  @Min(10000, { message: 'Deposit must be at least 10,000.' }) // Ensure deposit is >= 10,000
  deposit: number;

  @ApiProperty()
  @IsNumber({})
  @IsPositive() // Ensure service category ID is positive integer
  serviceCategoryId: number;
}
