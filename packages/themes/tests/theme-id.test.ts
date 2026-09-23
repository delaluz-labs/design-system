import { describe, expect, it } from 'vitest';
import { createThemeId } from '../src';

describe('createThemeId', (): void => {
  it('debe producir un identificador determinista', (): void => {
    const themeId = createThemeId({
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });

    expect(themeId).toBe('delaluz-dark-high-reduced');
  });
});
