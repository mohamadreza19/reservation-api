import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { BusinessService } from 'src/features/business/business.service';
import { CustomerService } from 'src/features/customer/customer.service';
import { CustomerPayload, UserPayload } from '../types/user-payload.interface';
import { UserRole } from '../types/user-role.enum';
import { UserSerializeRequest } from '../types/user-serialize-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private customerService: CustomerService,
    private businessService: BusinessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserSerializeRequest>();

    // Step 1: Extract JWT from the Authorization header
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Step 2: Verify and decode the JWT token
      const payload: UserPayload | CustomerPayload = this.jwtService.verify(
        token,
        {
          secret: process.env.JWT_SECRET, // Make sure to keep your JWT secret safe
        },
      );

      switch (payload.role) {
        case UserRole.Customer:
          const customer = await this.customerService.findOneById(
            payload.userId,
          );
          if (!customer) {
            throw new UnauthorizedException({ message: 'Customer not found' });
          }
          break;
        case UserRole.Business:
          const business = await this.businessService.findOneById(
            payload.userId,
          );
          if (!business) {
            throw new UnauthorizedException({ message: 'Business not found' });
          }
          break;
      }

      // Step 3: Attach the decoded payload (e.g., user data) to the request object
      request.user = payload;

      return true; // Grant access if the token is valid
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Extract JWT token from the Authorization header
  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1]; // Get the token part from "Bearer <token>"
    }
    return null;
  }
}
