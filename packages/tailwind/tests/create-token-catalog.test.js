import { describe, expect, it } from 'vitest';
import { classifyToken, createTokenCatalog } from '../scripts/tokens/create-token-catalog.mjs';

describe('createTokenCatalog', () => {
  it('genera un catálogo ordenado y sin duplicados', () => {
    const sources = [
      ':root { --delaluz-spacing-4: 1rem; }',
      ':root { --delaluz-radius-md: 8px; --delaluz-spacing-4: 1rem; }',
    ];
    const result = createTokenCatalog(sources, 'delaluz');

    expect(result.total).toBe(2);
    expect(result.tokens.map((token) => token.name)).toEqual([
      '--delaluz-radius-md',
      '--delaluz-spacing-4',
    ]);
  });

  it('respeta el prefijo configurado', () => {
    const result = createTokenCatalog(
      [':root { --ddl-spacing-4: 1rem; --delaluz-spacing-4: 1rem; }'],
      'ddl',
    );

    expect(result.total).toBe(1);
    expect(result.tokens[0].name).toBe('--ddl-spacing-4');
  });

  it('clasifica los tokens conocidos', () => {
    expect(classifyToken('--delaluz-color-primary', 'delaluz')).toBe('color');
    expect(classifyToken('--delaluz-radius-md', 'delaluz')).toBe('radius');
  });

  it('conserva los tokens de categorías desconocidas', () => {
    expect(classifyToken('--delaluz-custom-example', 'delaluz')).toBe('other');
  });

  it('rechaza prefijos inválidos', () => {
    expect(() => createTokenCatalog([], '--delaluz')).toThrow(TypeError);
  });
});
