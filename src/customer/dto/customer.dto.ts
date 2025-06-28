import { IsPhoneNumber, IsString, Length, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateCustomerDto {
  userInfo: User;
}
