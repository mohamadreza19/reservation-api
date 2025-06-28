export enum StorageProfile {
  ICONS = 'icons',
  BUSINESS_ASSETS = 'business-assets',
  USER_PROFILES = 'user-profiles',
  DEFAULT = 'default',
}

export interface StorageProfileConfig {
  allowedTypes: RegExp; // File types allowed (e.g., /jpeg|jpg|png/)
  maxFileSize: number; // Max file size in bytes
  destination: string; // Storage path (relative to project root)
}

export interface FileServiceConfig {
  profiles: Record<StorageProfile, StorageProfileConfig>;
  basePath: string; // Base path for all uploads (e.g., './uploads')
}

// Default configuration for storage profiles
export const defaultFileServiceConfig: FileServiceConfig = {
  basePath: './uploads',
  profiles: {
    [StorageProfile.ICONS]: {
      allowedTypes: /jpeg|jpg|png|svg/,
      maxFileSize: 2 * 1024 * 1024, // 2MB
      destination: 'service-icons',
    },
    [StorageProfile.BUSINESS_ASSETS]: {
      allowedTypes: /jpeg|jpg|png|pdf|doc|docx/,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      destination: 'business-assets',
    },
    [StorageProfile.USER_PROFILES]: {
      allowedTypes: /jpeg|jpg|png/,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      destination: 'user-profiles',
    },
    [StorageProfile.DEFAULT]: {
      allowedTypes: /jpeg|jpg|png/,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      destination: 'default',
    },
  },
};
