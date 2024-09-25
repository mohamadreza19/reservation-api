import { join } from 'path';
import { readdirSync, statSync } from 'fs';

/**
 * Recursively finds and imports all .entity.ts files as TypeORM entities.
 * @param dir The root directory to search
 * @returns An array of entity classes
 */
export function getAllEntitiesFromDir(dir: string): Function[] {
  const entities: Function[] = [];

  // Recursive function to find files in the directory
  function findEntities(directory: string) {
    const files = readdirSync(directory);

    for (const file of files) {
      const fullPath = join(directory, file);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        findEntities(fullPath); // If it's a directory, search recursively
      } else if (file.endsWith('.entity.ts')) {
        const entityModule = require(fullPath); // Dynamically import the file
        const entity = Object.values(entityModule) as any; // Get all exports from the file (assume entity is a named export)

        entities.push(...entity); // Push all the exports to entities array
      }
    }
  }

  findEntities(dir); // Start the search from the root directory
  return entities; // Return the list of found entities
}
