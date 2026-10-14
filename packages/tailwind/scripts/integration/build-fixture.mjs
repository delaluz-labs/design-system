import { mkdir, writeFile } from 'node:fs/promises';
import { generateTailwindTheme } from '../generate-theme.mjs';

const directory = new URL('../../tests/integration/generated/', import.meta.url);
const themeFile = new URL('theme.css', directory);
const mappings = {
  '--color-surface': '--delaluz-test-surface',
  '--color-content': '--delaluz-test-content',
  '--color-outline': '--delaluz-test-outline',
};

await mkdir(directory, { recursive: true });
await writeFile(themeFile, generateTailwindTheme(mappings), 'utf-8');

console.log('Fixture de integración generado.');
