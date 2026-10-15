import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const packageRoot = new URL('../', import.meta.url);

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf-8'),
);

const output = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
  cwd: packageRoot,
  encoding: 'utf8',
});

const [manifest] = JSON.parse(output);

const includedFiles = new Set(manifest.files.map(({ path }) => path));

const missing = [];

for (const [name, target] of Object.entries(packageJson.exports ?? {})) {
  if (typeof target !== 'string') {
    throw new Error(`Export no soportado por el validador: ${name}`);
  }

  const normalized = target.replace(/^\.\//, '');

  if (!includedFiles.has(normalized)) {
    missing.push(`${name} -> ${normalized}`);
  }
}

if (missing.length > 0) {
  throw new Error(`Exports ausentes del paquete:\n${missing.join('\n')}`);
}

console.log('Todos los exports están incluidos en npm pack.');
