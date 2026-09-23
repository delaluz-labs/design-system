import { describe, expect, it } from 'vitest';
import { createThemePermutations } from '../../scripts/theme/create-permutations.mjs';
import { resolveThemeTokens } from '../../scripts/theme/resolver/resolve-theme.mjs';

describe('todos los themes', () => {
  it('deben resolverse correctamente', async () => {
    const themes = createThemePermutations();

    for (const theme of themes) {
      const result = await resolveThemeTokens(theme);

      expect(result.tokens).toBeDefined();
      expect(Object.keys(result.tokens).length).toBeGreaterThan(0);
    }
  });
});
