import { createThemePermutations } from '../create-permutations.mjs';
import { resolveThemeTokens } from '../resolver/resolve-theme.mjs';

export async function validateThemeResolutions() {
  const permutations = createThemePermutations();

  for (const theme of permutations) {
    const result = await resolveThemeTokens(theme);

    if (!result.tokens || Object.keys(result.tokens).length === 0) {
      throw new Error('La resolución produjo un árbol de tokens vacío.');
    }
  }

  return permutations.length;
}
