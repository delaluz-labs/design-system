import { mkdir, writeFile } from 'node:fs/promises';
import { TOKEN_CONFIG } from '../../tokens/config/token-config.mjs';
import { readGeneratedTokenCss } from './tokens/read-generated-token-css.mjs';
import { createTokenCatalog } from './tokens/create-token-catalog.mjs';

/**
 * Genera el catálogo de tokens CSS disponibles.
 *
 * @returns {Promise<void>}
 */
export async function generateTokenCatalog() {
  const cssSources = await readGeneratedTokenCss();
  const catalog = createTokenCatalog(cssSources, TOKEN_CONFIG.cssVariablePrefix);
  const outputDirectory = new URL('../dist/', import.meta.url);
  const outputFile = new URL('../dist/token-catalog.json', import.meta.url);

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(catalog, null, 2)}\n`, 'utf-8');

  console.log(`Catálogo generado: ${catalog.total} variables CSS.`);
}

await generateTokenCatalog();
