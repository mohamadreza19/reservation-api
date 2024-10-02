import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
