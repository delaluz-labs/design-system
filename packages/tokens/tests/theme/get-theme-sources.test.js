import { describe, expect, it } from 'vitest';
import { getThemeSources } from '../../scripts/theme/get-theme-sources.mjs';

describe('getThemeSources', () => {
  it('omite las fuentes opcionales para un theme estándar', () => {
    const sources = getThemeSources({
      brand: 'delaluz',
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    });

    expect(sources).toEqual(['src/brand/delaluz.tokens.json', 'src/scheme/light.tokens.json']);
  });

  it('mantiene el orden brand, scheme, contrast y motion', () => {
    const sources = getThemeSources({
      brand: 'neutral',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });

    expect(sources).toEqual([
      'src/brand/neutral.tokens.json',
      'src/scheme/dark.tokens.json',
      'src/accessibility/high-contrast.tokens.json',
      'src/accessibility/reduced-motion.tokens.json',
    ]);
  });

  it.each([
    ['high', 'standard', 'src/accessibility/high-contrast.tokens.json'],
    ['standard', 'reduced', 'src/accessibility/reduced-motion.tokens.json'],
  ])(
    'selecciona las fuentes opcionales de forma independiente: %s, %s',
    (contrast, motion, expectedSource) => {
      expect(
        getThemeSources({
          brand: 'delaluz',
          scheme: 'light',
          contrast,
          motion,
        }),
      ).toEqual(['src/brand/delaluz.tokens.json', 'src/scheme/light.tokens.json', expectedSource]);
    },
  );
});
