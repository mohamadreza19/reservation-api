import { Role } from 'src/common/enums/role.enum';
import { ProfileDto } from './profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  profile: ProfileDto;

  role: Role;
}

export class AddOtp {
  otpCode: string;
  otpExpires: Date;
}

export class FindUserProfileDto {
  @ApiProperty({
    type: ProfileDto,
  })
  profile: ProfileDto;

  @ApiProperty({ enum: Role })
  role: Role;
  @ApiProperty()
  id: string;
}
