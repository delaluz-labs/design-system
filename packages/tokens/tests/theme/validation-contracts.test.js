import { describe, expect, it } from 'vitest';
import { validateResolvedAliases } from '../../scripts/theme/validation/aliases.mjs';
import { extractExternalReferences } from '../../scripts/theme/validation/references.mjs';

function dictionary(value) {
  return {
    allTokens: [{ path: ['semantic', 'color'], value }],
  };
}

describe('resolved aliases', () => {
  it.each(['#ffffff', 0, false, null, ['red', 'blue'], { color: 'red' }].map((value) => [value]))(
    'acepta valores resueltos: %j',
    (value) => {
      expect(validateResolvedAliases(dictionary(value))).toBe(1);
    },
  );

  it.each(
    [
      '{color.blue.500}',
      ['red', '{color.blue.500}'],
      { nested: { color: '{color.blue.500}' } },
    ].map((value) => [value]),
  )('rechaza aliases pendientes: %j', (value) => {
    expect(() => validateResolvedAliases(dictionary(value))).toThrow('semantic.color');
  });

  it('acepta un diccionario vacío', () => {
    expect(validateResolvedAliases({ allTokens: [] })).toBe(0);
  });
});

describe('external references', () => {
  it('extrae referencias de sets y modifiers sin duplicados', () => {
    const resolver = {
      sets: {
        base: {
          sources: [{ $ref: 'base.json' }, { $ref: '#/sets/internal' }, {}, null, { $ref: 42 }],
        },
      },
      modifiers: {
        scheme: {
          contexts: {
            light: [{ $ref: 'base.json' }, { $ref: 'light.json' }],
            dark: [{ $ref: 'dark.json' }],
          },
        },
      },
    };

    expect(extractExternalReferences(resolver)).toEqual(['base.json', 'light.json', 'dark.json']);
  });

  it('devuelve una lista vacía cuando no hay fuentes', () => {
    expect(extractExternalReferences({ sets: {}, modifiers: {} })).toEqual([]);
  });
});
