import { createThemePermutations } from '../theme/create-permutations.mjs';
import { resolveThemeTokens } from '../theme/resolver/resolve-theme.mjs';
import { buildTheme } from './build-theme.mjs';
import { createThemeId } from '../theme/create-theme-id.mjs';

export async function buildThemes() {
  const permutations = createThemePermutations();

  for (const theme of permutations) {
    const id = createThemeId(theme);
    const { tokens } = await resolveThemeTokens(theme);

    await buildTheme({ id, tokens });

    console.log(`Theme generado: ${id}`);
  }
}
