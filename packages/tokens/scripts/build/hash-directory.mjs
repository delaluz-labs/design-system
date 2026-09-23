import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

async function getFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getFiles(filePath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(filePath);
    }
  }

  return files;
}

export async function hashDirectory(directory) {
  const files = await getFiles(directory);
  files.sort();
  const hash = createHash('sha256');

  for (const file of files) {
    const content = await readFile(file);
    const relativePath = relative(directory, file);
    hash.update(relativePath);
    hash.update(content);
  }

  return hash.digest('hex');
}
