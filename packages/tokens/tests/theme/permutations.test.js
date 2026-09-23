import { describe, expect, it } from 'vitest';
import { createThemePermutations } from '../../scripts/theme/create-permutations.mjs';
import { createThemeId } from '../../scripts/theme/create-theme-id.mjs';

describe('createThemePermutations', () => {
  it('debe generar exactamente 16 combinaciones', () => {
    const themes = createThemePermutations();

    expect(themes).toHaveLength(16);
  });

  it('debe generar IDs únicos', () => {
    const ids = createThemePermutations().map(createThemeId);

    expect(new Set(ids).size).toBe(16);
  });

  it('debe incluir los dos brands', () => {
    const brands = new Set(createThemePermutations().map(({ brand }) => brand));

    expect(brands).toEqual(new Set(['delaluz', 'neutral']));
  });
});
