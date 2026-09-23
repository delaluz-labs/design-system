import { describe, expect, it } from 'vitest';
import { BRANDS } from '../src/theme-registry';

describe('theme registry', () => {
  it('contiene las marcas soportadas sin duplicados', () => {
    const identifiers = BRANDS.map(({ id }) => id);

    expect(identifiers).toEqual(['delaluz', 'neutral']);
    expect(new Set(identifiers).size).toBe(BRANDS.length);
  });

  it('declara etiquetas no vacías para todas las marcas', () => {
    for (const { label } of BRANDS) {
      expect(typeof label).toBe('string');
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });
});
