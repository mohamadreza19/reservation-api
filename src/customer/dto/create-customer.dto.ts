import { IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateCustomerDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @Length(6, 30)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
