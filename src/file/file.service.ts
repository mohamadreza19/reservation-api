import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamicEntityService } from './dynamic-entity.service';
import { join } from 'path';
import {
  existsSync,
  createReadStream,
  writeFileSync,
  mkdirSync,
  unlinkSync,
} from 'fs';
import { StreamableFile } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  StorageProfile,
  StorageProfileConfig,
  FileServiceConfig,
  defaultFileServiceConfig,
} from './config/file.config';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly config: FileServiceConfig;
  private readonly storagePath: string;

  constructor(
    private readonly dynamicEntity: DynamicEntityService,
    configService?: ConfigService,
  ) {
    this.config = {
      ...defaultFileServiceConfig,
      ...configService?.get<FileServiceConfig>('fileServiceConfig'),
    };
    this.storagePath = join(__dirname, '..', '..', this.config.basePath);
  }

  // New file serving methods
  async getFileStream(entity: string, id: string): Promise<StreamableFile> {
    if (!this.dynamicEntity.isEntityAllowed(entity)) {
      throw new BadRequestException(
        `Entity '${entity}' is not allowed for file operations`,
      );
    }

    const repo = this.dynamicEntity.getRepository(entity);
    const fileField = this.dynamicEntity.getFileField(entity);

    if (!fileField) {
      throw new BadRequestException(
        `Entity '${entity}' does not support file operations`,
      );
    }

    const record = await repo.findOneBy({ id });
    if (!record || !record[fileField]) {
      throw new NotFoundException('File not found for this entity');
    }

    const fullPath = join(this.storagePath, record[fileField]);
    if (!existsSync(fullPath)) {
      throw new NotFoundException('File not found on disk');
    }

    this.logger.log(`Serving file: ${fullPath}`);
    return new StreamableFile(createReadStream(fullPath));
  }

  async saveFile(
    entity: string,
    id: string,
    file: Express.Multer.File,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!this.dynamicEntity.isEntityAllowed(entity)) {
      throw new BadRequestException(
        `Entity '${entity}' is not allowed for file operations`,
      );
    }

    const repo = this.dynamicEntity.getRepository(entity);
    const fileField = this.dynamicEntity.getFileField(entity);

    if (!fileField) {
      throw new BadRequestException(
        `Entity '${entity}' does not support file operations`,
      );
    }

    const record = await repo.findOneBy({ id });
    if (!record) {
      throw new NotFoundException('Entity not found');
    }

    // Delete old file if exists
    if (record[fileField]) {
      await this.deleteFile(record[fileField]);
    }

    // Create entity folder
    const entityFolder = join(this.storagePath, entity);
    mkdirSync(entityFolder, { recursive: true });

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const filename = `${uuidv4()}.${fileExtension}`;
    const relativePath = `${entity}/${filename}`;
    const fullPath = join(this.storagePath, relativePath);

    // Save file to disk
    writeFileSync(fullPath, file.buffer);

    // Update database record
    record[fileField] = relativePath;
    await repo.save(record);

    this.logger.log(`File saved: ${fullPath}`);
  }

  // Legacy methods (keeping for backward compatibility)
  registerProfile(profileName: string, config: StorageProfileConfig): void {
    if (this.config.profiles[profileName as StorageProfile]) {
      this.logger.warn(
        `Profile ${profileName} already exists and will be overwritten`,
      );
    }
    this.config.profiles[profileName as StorageProfile] = config;
  }

  getFileUrl(
    file: Express.Multer.File,
    profileOrDestination?: StorageProfile | string,
  ): string {
    const destination =
      typeof profileOrDestination === 'string' &&
      this.config.profiles[profileOrDestination]
        ? this.config.profiles[profileOrDestination].destination
        : profileOrDestination ||
          this.config.profiles[StorageProfile.DEFAULT].destination;
    return `/${join('uploads', destination, file.filename)}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const absolutePath = join(this.storagePath, filePath);
    if (existsSync(absolutePath)) {
      try {
        unlinkSync(absolutePath);
        this.logger.log(`Deleted file: ${filePath}`);
      } catch (error) {
        this.logger.error(`Failed to delete file: ${filePath}`, error);
        throw new BadRequestException(`Failed to delete file: ${filePath}`);
      }
    } else {
      this.logger.warn(`File not found for deletion: ${filePath}`);
    }
  }
}
