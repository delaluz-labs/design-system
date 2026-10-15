import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';

const packageRoot = new URL('../', import.meta.url);
const outputDirectory = new URL('../dist/', import.meta.url);

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = `${prefix}${entry.name}`;
    const location = new URL(entry.name, directory);

    if (entry.isDirectory()) {
      const newDirectory = new URL(`${entry.name}/`, directory);
      files.push(...(await listFiles(newDirectory, `${relativePath}/`)));
    } else if (entry.isFile()) {
      files.push({ name: relativePath, location });
    }
  }

  return files.sort((a, b) => a.name.localeCompare(b.name));
}

async function calculateHashes() {
  const files = await listFiles(outputDirectory);

  return Promise.all(
    files.map(async ({ name, location }) => {
      const content = await readFile(location);

      return {
        name,
        hash: createHash('sha256').update(content).digest('hex'),
      };
    }),
  );
}

function build() {
  execFileSync('npm', ['run', 'build'], {
    cwd: packageRoot,
    stdio: 'inherit',
  });
}

build();
const firstBuild = await calculateHashes();

build();
const secondBuild = await calculateHashes();

if (JSON.stringify(firstBuild) !== JSON.stringify(secondBuild)) {
  throw new Error('El build no es determinista: se detectaron diferencias.');
}

console.log('Build determinista verificado correctamente.');
