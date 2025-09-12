import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';

interface SaveFileOptions {
  file: Express.Multer.File;
  storagePath?: string; // absolute base path, e.g. /var/app/uploads
  destination: string; // relative folder inside storagePath, e.g. "profile"
}
interface DeleteFileOptions {
  filePath: string; // relative path like "profile/uuid.png"
  storagePath?: string; // absolute base path, optional
}

const STORAGE_PATH = join(__dirname, '..', '..', '..', 'uploads');
export function saveFileToDisk(options: SaveFileOptions) {
  const { file, storagePath, destination } = options;
  // src / common / utils / file - storage.util.ts;

  const _storagePath = storagePath || STORAGE_PATH;

  // Ensure destination folder exists
  const targetDir = join(_storagePath, destination);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // Generate unique filename
  const fileExtension = file.originalname.split('.').pop();
  const filename = `${uuidv4()}.${fileExtension}`;

  // Build paths
  const relativePath = `${destination}/${filename}`;
  const fullPath = join(_storagePath, relativePath);

  // Save file buffer to disk
  writeFileSync(fullPath, file.buffer);

  return {
    filename,
    relativePath,
    fullPath,
  };
}

export function deleteFileFromDisk({
  filePath,
  storagePath,
}: DeleteFileOptions): boolean {
  try {
    const _storagePath = storagePath || STORAGE_PATH;

    const fullPath = join(_storagePath, filePath);

    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
      return true; // file deleted
    }
    return false; // file not found
  } catch (err) {
    console.error('Error deleting file:', err);
    return false;
  }
}
