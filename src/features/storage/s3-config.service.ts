// s3-config.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  BucketCannedACL,
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { IStorageService } from 'src/shared/types/storage-service.interface';

enum S3ExceptionErrorCode {
  NOTFOUND = 'ENOTFOUND',
}

@Injectable()
export class S3ConfigService implements IStorageService {
  private s3Client: S3Client;
  private readonly logger = new Logger(S3ConfigService.name);

  constructor() {
    const config: S3ClientConfig = {
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };
    this.s3Client = new S3Client(config);

    this.createBucketIfNotExists();
  }
  async uploadFile(file: Express.Multer.File): Promise<any> {
    const fileKey = `${Date.now()}-${file.originalname}`;
    try {
      const params = {
        Bucket: process.env.GLOBAL_BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(params);
      const result = await this.s3Client.send(command);
      return result.$metadata;
    } catch (error) {}
  }
  getFile(filename: string): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }
  deleteFile(filename: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async createBucketIfNotExists(): Promise<void> {
    try {
      await this.s3Client.send(
        new HeadBucketCommand({
          Bucket: process.env.GLOBAL_BUCKET,
        }),
      );

      this.logger.log(`Bucket '${process.env.GLOBAL_BUCKET}' exists.`);
    } catch (err) {
      console.log(err);
      if (err.name === S3ExceptionErrorCode.NOTFOUND) {
        // Check for the specific error name
        await this.createBucket();
      } else {
        this.logger.error('Error checking bucket existence:', err);
        throw new InternalServerErrorException('Error checking S3 bucket');
      }
    }
  }

  private async createBucket(): Promise<void> {
    try {
      const data = await this.s3Client.send(
        new CreateBucketCommand({
          Bucket: process.env.GLOBAL_BUCKET,
          ACL: process.env.AWS_ACL as BucketCannedACL,
        }),
      );
      this.logger.log(`Bucket created: ${JSON.stringify(data)}`);
    } catch (err) {
      this.logger.error('Error creating bucket:', err);
      throw new InternalServerErrorException('Failed to create S3 bucket');
    }
  }
}
