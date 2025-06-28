// multer-config.ts
import { BadRequestException, Logger } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
import {
  StorageProfile,
  StorageProfileConfig,
  FileServiceConfig,
  defaultFileServiceConfig,
} from './file.config';

export class MulterConfig {
  private static readonly logger = new Logger(MulterConfig.name);
  private static readonly config: FileServiceConfig = defaultFileServiceConfig;

  /**
   * Initialize storage directories
   */
  private static initializeDirectories() {
    Object.values(this.config.profiles).forEach((profile) => {
      const fullPath = join(this.config.basePath, profile.destination);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
        this.logger.log(`Created storage directory: ${fullPath}`);
      }
    });
  }

  /**
   * Get Multer upload options based on a storage profile or custom configuration
   * @param profileOrConfig Profile name or custom configuration
   * @returns Multer options
   */
  public static getUploadOptions(
    profileOrConfig:
      | StorageProfile
      | Partial<StorageProfileConfig> = StorageProfile.DEFAULT,
  ) {
    this.initializeDirectories();

    const config =
      typeof profileOrConfig === 'string'
        ? this.config.profiles[profileOrConfig] ||
          this.config.profiles[StorageProfile.DEFAULT]
        : {
            ...this.config.profiles[StorageProfile.DEFAULT],
            ...profileOrConfig,
          };

    const destination = join(this.config.basePath, config.destination);
    if (!existsSync(destination)) {
      mkdirSync(destination, { recursive: true });
      this.logger.log(`Created storage directory: ${destination}`);
    }

    return {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, destination);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname).toLowerCase()}`;
          callback(null, uniqueSuffix);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = config.allowedTypes;
        const ext = extname(file.originalname).toLowerCase();
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && allowedTypes.test(ext)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              `Only files with types matching ${allowedTypes} are allowed`,
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: config.maxFileSize,
      },
    };
  }
}
