require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Read connection string from .env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not defined in .env');
  process.exit(1);
}

// Setup output directory and filename
const outputDir = path.resolve(__dirname, '..', '..', 'backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(outputDir, `postgres-backup-${timestamp}.sql`);

// Create the backups folder if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Construct the pg_dump command
const dumpCommand = `pg_dump "${connectionString}" -F p -f "${backupFile}"`;

console.log('📦 Starting PostgreSQL backup...');

exec(dumpCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Backup failed: ${error.message}`);
    return;
  }

  if (stderr) {
    console.warn(`⚠️ pg_dump output: ${stderr}`);
  }

  console.log(`✅ Backup completed: ${backupFile}`);
});
