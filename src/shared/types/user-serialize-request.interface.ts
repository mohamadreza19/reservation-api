import { Request } from 'express';
import { UserPayload } from './user-payload.interface';

export interface UserSerializeRequest extends Request {
  user: UserPayload;
}
