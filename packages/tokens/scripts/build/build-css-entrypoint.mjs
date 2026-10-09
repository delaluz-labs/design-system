import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createThemePermutations } from '../theme/create-permutations.mjs';
import { createThemeId } from '../theme/create-theme-id.mjs';

const OUTPUT_DIRECTORY = new URL('../../dist/css/', import.meta.url);
const OUTPUT_FILE = new URL('../../dist/css/index.css', import.meta.url);

async function assertCssFileExists(relativePath) {
  const file = new URL(relativePath, OUTPUT_DIRECTORY);
  await readFile(file, 'utf8');
}

export async function buildCssEntrypoint() {
  const permutations = createThemePermutations();
  const imports = [
    './base.css',
    ...permutations.map(
      (theme) => `../themes/${createThemeId(theme)}/tokens.css`,
    ),
    './foundations.css',
  ];

  for (const path of imports) {
    await assertCssFileExists(path);
  }

  const content = imports.map((path) => `@import '${path}';`)
    .join('\n');

  await mkdir(OUTPUT_DIRECTORY, { recursive: true });
  await writeFile(OUTPUT_FILE, `${content}\n`, 'utf8');
}
