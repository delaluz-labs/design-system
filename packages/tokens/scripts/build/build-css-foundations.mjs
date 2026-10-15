import { mkdir, writeFile } from 'node:fs/promises';
import { TOKEN_CONFIG } from '../../config/token-config.mjs';

export function createCssFoundations() {
  const prefix = TOKEN_CONFIG.cssVariablePrefix;

  return [
    '/* CSS Foundations generado automáticamente. */',
    '',
    ':root {',
    '  color-scheme: light;',
    `  --${prefix}-foundation-color-scheme: light;`,
    '}',
    '',
    ':root[data-theme-scheme="dark"] {',
    '  color-scheme: dark;',
    `  --${prefix}-foundation-color-scheme: dark;`,
    '}',
    '',
    ':root[data-theme-scheme="light"] {',
    '  color-scheme: light;',
    `  --${prefix}-foundation-color-scheme: light;`,
    '}',
    '',
  ].join('\n');
}

export async function buildCssFoundations() {
  const directory = new URL('../../dist/css/', import.meta.url);
  const file = new URL('../../dist/css/foundations.css', import.meta.url);

  await mkdir(directory, { recursive: true });
  await writeFile(file, createCssFoundations(), 'utf8');
}
