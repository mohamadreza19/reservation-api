export interface IStorageService {
  uploadFile(file: Express.Multer.File): Promise<string>;

  getFile(filename: string): Promise<Buffer>;

  deleteFile(filename: string): Promise<void>;
}
