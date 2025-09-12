import { Role } from 'src/common/enums/role.enum';
import { ProfileDto } from './profile.dto';

export class CreateUserDto {
  profile: ProfileDto;

  role: Role;
}

export class AddOtp {
  otpCode: string;
  otpExpires: Date;
}
