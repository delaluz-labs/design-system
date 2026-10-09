import { describe, expect, it } from 'vitest';
import { createThemeSelector } from '../../scripts/theme/create-theme-selector.mjs';

describe('createThemeSelector', () => {
  it('debe generar el selector CSS completo', () => {
    const selector = createThemeSelector({
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });

    expect(selector).toBe(
      ':root' +
        '[data-theme-brand="delaluz"]' +
        '[data-theme-scheme="dark"]' +
        '[data-theme-contrast="high"]' +
        '[data-theme-motion="reduced"]',
    );
  });

  it('debe rechazar un theme nulo', () => {
    expect(() => createThemeSelector(null)).toThrow(TypeError);
  });

  it('debe rechazar propiedades vacías', () => {
    expect(() =>
      createThemeSelector({
        brand: '',
        scheme: 'dark',
        contrast: 'high',
        motion: 'reduced',
      }),
    ).toThrow('La propiedad "brand" del theme debe ser una cadena no vacía.');
  });
});
