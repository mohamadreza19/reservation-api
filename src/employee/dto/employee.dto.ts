import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsPhoneNumber, IsUUID } from 'class-validator';

export class AddServiceDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @ApiProperty({
    type: [String],
  })
  serviceIds: string[];
}
export class DismissServiceDto extends AddServiceDto {}

export class EmployeeRegisterDto {
  @ApiProperty({
    description: 'Phone number of the user',
    example: '+989123456789',
  })
  @IsPhoneNumber('IR') // adjust for your region
  phoneNumber: string;
}

export class HireToBusinessDto {
  @ApiProperty()
  @IsUUID()
  employeeRegisterId: string;
}
