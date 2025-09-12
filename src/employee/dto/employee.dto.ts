import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  isEnum,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';
import { EmployeeRegisterStatus } from 'src/common/enums/employee-register-status.enum';

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
export class UpdateEmployeeRegisterDto {
  @ApiProperty()
  @IsUUID()
  employeeRegisterId: string;

  @ApiProperty({
    enum: EmployeeRegisterStatus,
  })
  @IsEnum(EmployeeRegisterStatus)
  status: EmployeeRegisterStatus;
}
