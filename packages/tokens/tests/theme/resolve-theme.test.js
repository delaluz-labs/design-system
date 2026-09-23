import { describe, expect, it } from 'vitest';
import { resolveThemeTokens } from '../../scripts/theme/resolver/resolve-theme.mjs';

describe('resolveThemeTokens', () => {
  it('debe resolver el theme dark de De la Luz', async () => {
    const entryToken = {
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'standard',
      motion: 'standard',
    };
    const result = await resolveThemeTokens({ ...entryToken });

    expect(result.input).toEqual(entryToken);
    expect(result.tokens.brand.primary).toBeDefined();
    expect(result.tokens.semantic.color.background.default).toBeDefined();
  });
});
