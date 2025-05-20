import { IsPhoneNumber, IsString } from 'class-validator';

export class VerifyPhoneDto {
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  code: string;
}
