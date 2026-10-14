import { readFile } from 'node:fs/promises';
import { createThemePermutations } from '../../../tokens/scripts/theme/create-permutations.mjs';
import { createThemeId } from '../../../tokens/scripts/theme/create-theme-id.mjs';

/**
 * Obtiene las rutas de los archivos CSS generados.
 *
 * @returns {URL[]}
 */
export function getGeneratedTokenCssFiles() {
  return [
    new URL('../../../tokens/dist/css/base.css', import.meta.url),

    ...createThemePermutations().map((theme) => {
      const id = createThemeId(theme);

      return new URL(`../../../tokens/dist/themes/${id}/tokens.css`, import.meta.url);
    }),
  ];
}

/**
 * Lee el CSS base y las combinaciones de temas.
 *
 * @returns {Promise<{
 *   base: string,
 *   themes: Array<{id: string, css: string}>
 * }>}
 */
export async function readGeneratedTokenCssByTheme() {
  const base = await readFile(
    new URL('../../../tokens/dist/css/base.css', import.meta.url),
    'utf-8',
  );
  const themes = await Promise.all(
    createThemePermutations().map(async (theme) => {
      const id = createThemeId(theme);
      const css = await readFile(
        new URL(`../../../tokens/dist/themes/${id}/tokens.css`, import.meta.url),
        'utf-8',
      );

      return { id, css };
    }),
  );

  return { base, themes };
}

/**
 * Mantiene compatibilidad con el catálogo de tokens.
 *
 * @returns {Promise<string[]>}
 */
export async function readGeneratedTokenCss() {
  const { base, themes } = await readGeneratedTokenCssByTheme();

  return [base, ...themes.map(({ css }) => css)];
}
