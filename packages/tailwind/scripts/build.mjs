import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { TOKEN_CONFIG } from '../../tokens/config/token-config.mjs';
import { TOKEN_MAPPINGS } from '../config/token-mappings.mjs';
import { generateTailwindTheme } from './generate-theme.mjs';
import { readGeneratedTokenCssByTheme } from './tokens/read-generated-token-css.mjs';
import { validateThemeCoverage } from './tokens/validate-theme-coverage.mjs';

/**
 * Resuelve los nombres CSS utilizando el prefijo configurado.
 *
 * @returns {Record<string, string>}
 */
export function createTailwindMappings() {
  const prefix = TOKEN_CONFIG.cssVariablePrefix;

  return Object.fromEntries(
    Object.entries(TOKEN_MAPPINGS).map(([name, mapping]) => [name, `--${prefix}-${mapping.token}`]),
  );
}

/**
 * Genera los archivos públicos del adaptador.
 *
 * @returns {Promise<void>}
 */
export async function buildTailwindAdapter() {
  if (Object.keys(TOKEN_MAPPINGS).length === 0) {
    throw new Error(
      [
        'No se puede generar @delaluz/tailwind.',
        'TOKEN_MAPPINGS no contiene mapeos.',
        '',
        'El catálogo de tokens se ha generado correctamente.',
        'Consulta: packages/tailwind/dist/token-catalog.json',
        '',
        'Configura al menos un token válido en:',
        'packages/tailwind/config/token-mappings.mjs',
      ].join('\n'),
    );
  }

  const sources = await readGeneratedTokenCssByTheme();

  validateThemeCoverage(TOKEN_MAPPINGS, sources, TOKEN_CONFIG.cssVariablePrefix);

  const mappings = createTailwindMappings();
  const directory = new URL('../dist/', import.meta.url);

  await mkdir(directory, { recursive: true });
  await writeFile(
    new URL('../dist/theme.css', import.meta.url),
    generateTailwindTheme(mappings),
    'utf-8',
  );

  const variants = await readFile(new URL('../src/variants.css', import.meta.url), 'utf-8');

  await writeFile(new URL('../dist/variants.css', import.meta.url), variants, 'utf-8');

  console.log('Adaptador Tailwind generado correctamente.');
}

await buildTailwindAdapter();
