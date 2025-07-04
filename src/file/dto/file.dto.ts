import { User } from 'src/user/entities/user.entity';

export class SaveFileDto {
  entity: string;
  id: string;
  file: Express.Multer.File;
  user: User;
}
export class GetFileStreamDto {
  entity: string;
  id: string;
  //   file: Express.Multer.File;
  user: User;
}
