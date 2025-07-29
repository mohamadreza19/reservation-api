import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Payload } from 'src/common/models/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') as any,
    });
  }

  async validate(payload: Payload): Promise<User> {
    const protectedUser = await this.userService.findOne({
      id: payload.userId,
    });
    // console.log('26', payload);
    // console.log('27', protectedUser);
    if (!protectedUser) {
      console.error('User not found for ID:', payload.userId);
      throw new UnauthorizedException('User not found or deactivated');
    }

    return protectedUser;
  }
}
