import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'The full name of the employee',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  //   @ApiPropertyOptional({
  //     description: 'The specialization of the employee',
  //     example: 'Hair Stylist',
  //   })
  //   @IsOptional()
  //   @IsString()
  //   specialization?: string;

  @ApiProperty({
    description: 'The ID of the business the employee belongs to',
    example: 'uuid-of-business',
  })
  @IsUUID()
  businessId: string;

  @ApiPropertyOptional({
    description: 'The ID of the user linked to the employee (optional)',
    example: 'uuid-of-user',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  // businessId and userId are not included, as they typically shouldn't change
}
