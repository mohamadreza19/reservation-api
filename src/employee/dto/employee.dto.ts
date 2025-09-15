import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  isEnum,
  IsOptional,
  IsPhoneNumber,
  IsUUID,
} from 'class-validator';
import { EmployeeRegisterStatus } from 'src/common/enums/employee-register-status.enum';
import { FindUserProfileDto } from 'src/user/dto/user.dto';

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
  @ApiProperty()
  isActive: boolean;
}

export class FindRegisterRequestsDto {
  @ApiPropertyOptional({
    description: 'ID of the employee register request',
    type: String,
  })
  @IsUUID()
  @IsOptional()
  employeeRegisterId?: string;

  @ApiPropertyOptional({
    description: 'Status of the register request',
    enum: EmployeeRegisterStatus,
  })
  @IsEnum(EmployeeRegisterStatus)
  @IsOptional()
  status?: EmployeeRegisterStatus;
}

export class FindEmployeeProfile {
  @ApiProperty()
  id: string;
  @ApiProperty({
    type: FindUserProfileDto,
  })
  userInfo: FindUserProfileDto;
}
