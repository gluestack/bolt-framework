import { join } from 'path';
import archiver from 'archiver';
import { createWriteStream, mkdirSync } from 'fs';
import { formatBytes } from '../format-bytes';
import { fileExists } from '../file-exists';
import * as readline from "readline";

export const zip = async (project_path: string) => {
  const filename = 'output.zip';
  const directory = join(project_path, '.deploy');

  const zipPath = join(directory, filename);
  if (!await fileExists(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  const promise = new Promise((resolve, reject) => {
    // create a file to stream archive data to.
    const output = createWriteStream(zipPath);

    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', () => {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`> Compressed ${formatBytes(archive.pointer())} into "${filename}"!`);
      console.log();
      resolve(zipPath);
    });

    archive.on('progress', (progress) => {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`> In progress: processed ${progress.entries.processed} files & ${formatBytes(progress.fs.processedBytes)} of data`);
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', (err) => {
      console.log('> Warning:', err);
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err;
      }
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', () => {
      console.log('Data has been drained');
    });

    // good practice to catch this error explicitly
    archive.on('error', (err: any) => {
      reject(err);
    });

    // pipe archive data to the file
    archive.pipe(output);

    // append files from a glob pattern
    archive.glob('**', {
      ignore: [
        '**/storage/**/data/**',
        '**/databases/**/db/**',
        'node_modules/*',
        '**/node_modules/**',
        '**/.DS_Store',
        '.git/**',
        '**/*.zip',
        '.deploy',
        '**/.next/**',
      ],
      cwd: project_path,
      dot: true
    });

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize();
  });

  await Promise.all([promise]);

  return { zipPath };
};
