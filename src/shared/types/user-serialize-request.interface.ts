import { Request } from 'express';
import { CustomerPayload, UserPayload } from './user-payload.interface';

export interface UserSerializeRequest extends Request {
  user: UserPayload | CustomerPayload;
}
export function isCustomerPayload(
  user: UserPayload | CustomerPayload,
): user is CustomerPayload {
  return (user as CustomerPayload).businessId !== undefined;
}
