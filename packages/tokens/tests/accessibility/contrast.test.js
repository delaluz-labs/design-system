import { describe, expect, it } from 'vitest';
import { contrastRatio, relativeLuminance } from '../../scripts/accessibility/contrast.mjs';
import { parseHexColor } from '../../scripts/accessibility/parse-color.mjs';

describe('contrastRatio', () => {
  it('negro sobre blanco debe producir aproximadamente 21:1', () => {
    const black = parseHexColor('#000000');
    const white = parseHexColor('#ffffff');

    expect(black).toEqual({ r: 0, g: 0, b: 0 });
    expect(white).toEqual({ r: 255, g: 255, b: 255 });

    const ratio = contrastRatio(black, white);

    expect(ratio).toBeCloseTo(21, 5);
  });

  it('colores iguales deben producir 1:1', () => {
    const white = parseHexColor('#ffffff');
    const ratio = contrastRatio(white, white);

    expect(ratio).toBeCloseTo(1, 5);
  });
});

describe('relativeLuminance', () => {
  it('negro debe tener luminancia 0', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
  });

  it('blanco debe tener luminancia 1', () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
  });
});
