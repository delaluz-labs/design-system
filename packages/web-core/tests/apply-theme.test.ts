import { describe, expect, it } from 'vitest';
import { applyTheme, THEME_ATTRIBUTES } from '../src';

describe('applyTheme', (): void => {
  it('debe aplicar todas las dimensiones del theme', (): void => {
    const element: HTMLDivElement = document.createElement('div');

    applyTheme(element, {
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });

    expect(element.getAttribute(THEME_ATTRIBUTES.brand)).toBe('delaluz');
    expect(element.getAttribute(THEME_ATTRIBUTES.scheme)).toBe('dark');
    expect(element.getAttribute(THEME_ATTRIBUTES.contrast)).toBe('high');
    expect(element.getAttribute(THEME_ATTRIBUTES.motion)).toBe('reduced');
  });

  it('debe reemplazar un theme previamente aplicado', (): void => {
    const element: HTMLDivElement = document.createElement('div');

    applyTheme(element, {
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });

    applyTheme(element, {
      brand: 'neutral',
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    });

    expect(element.getAttribute(THEME_ATTRIBUTES.brand)).toBe('neutral');
    expect(element.getAttribute(THEME_ATTRIBUTES.scheme)).toBe('light');
    expect(element.getAttribute(THEME_ATTRIBUTES.contrast)).toBe('standard');
    expect(element.getAttribute(THEME_ATTRIBUTES.motion)).toBe('standard');
  });
});
