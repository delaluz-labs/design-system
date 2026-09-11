import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['src/primitive', 'src/semantic', 'src/component'];
let filesChecked = 0;

for (const root of roots) {
  const files = await readdir(root);

  for (const filename of files) {
    if (!filename.endsWith('.tokens.json')) {
      continue;
    }

    const path = join(root, filename);
    const source = await readFile(path, 'utf-8');
    JSON.parse(source);

    filesChecked += 1;
  }
}

if (filesChecked === 0) {
  throw new Error('No se encontraron archivos de tokens.');
}

console.log(`Tokens válidos: ${filesChecked} archivos analizados.`);
