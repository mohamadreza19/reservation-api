import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { IsPhoneNumberCustom } from 'src/shared/validators/phone-number.validator';

export class UpdateBusinessDto {
  //   @IsPhoneNumberCustom({ message: 'Phone number must be exactly 10 digits.' })
  //   phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subDomainName: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  businessCategoryId: number;
}
