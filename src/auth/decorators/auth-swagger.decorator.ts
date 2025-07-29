import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { RefreshTokenResponseDto } from '../dto/refresh-token-response.dto';
import { VerifyOtpResponseDto } from '../dto/verify-otp-response.dto';

export function ApiVerifyOtpResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'OTP verified successfully, returns access token',
      type: VerifyOtpResponseDto,
    }),
  );
}

export function ApiRefreshTokenResponse() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description:
        'Refresh token verified successfully, returns new access token',
      type: RefreshTokenResponseDto,
    }),
  );
}
