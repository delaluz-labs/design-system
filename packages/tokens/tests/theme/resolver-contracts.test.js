import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateResolverInput } from '../../scripts/theme/resolver/validate-input.mjs';
import { resolveInternalReference } from '../../scripts/theme/resolver/resolve-reference.mjs';
import { loadTokenSource } from '../../scripts/theme/resolver/load-token-source.mjs';
import { resolveOrder } from '../../scripts/theme/resolver/resolve-order.mjs';

const fs = vi.hoisted(() => ({
  readFile: vi.fn(),
}));

vi.mock('node:fs/promises', () => fs);

beforeEach(() => {
  vi.resetAllMocks();
});

function createResolver() {
  return {
    modifiers: {
      scheme: {
        default: 'light',
        contexts: { light: [], dark: [] },
      },
    },
  };
}

describe('resolver input', () => {
  it('usa defaults y permite sustituirlos explícitamente', () => {
    const resolver = createResolver();

    expect(validateResolverInput(resolver, {})).toEqual({ scheme: 'light' });
    expect(validateResolverInput(resolver, { scheme: 'dark' })).toEqual({ scheme: 'dark' });
  });

  it('acepta un resolver sin modifiers si la entrada está vacía', () => {
    expect(validateResolverInput({}, {})).toEqual({});
  });

  it('rechaza modifiers desconocidos', () => {
    expect(() => validateResolverInput(createResolver(), { unknown: 'x' })).toThrow(
      'El modifier "unknown" no existe.',
    );
  });

  it('rechaza contexts desconocidos', () => {
    expect(() => validateResolverInput(createResolver(), { scheme: 'sepia' })).toThrow(
      'El contexto "sepia" no existe',
    );
  });

  it('rechaza valores ausentes cuando no existe default', () => {
    const resolver = createResolver();
    delete resolver.modifiers.scheme.default;

    expect(() => validateResolverInput(resolver, {})).toThrow(
      'requiere un valor y no tiene default',
    );
  });
});

describe('internal references', () => {
  it('decodifica segmentos JSON Pointer', () => {
    const resolver = { 'a/b': { '~name': 42 } };

    expect(resolveInternalReference(resolver, '#/a~1b/~0name')).toBe(42);
  });

  it('rechaza referencias externas', () => {
    expect(() => resolveInternalReference({}, 'tokens.json')).toThrow(
      'La referencia interna no es válida',
    );
  });

  it.each([
    [{}, '#/missing'],
    [{ node: null }, '#/node/value'],
    [{ node: 1 }, '#/node/value'],
    [{}, '#/toString'],
  ])('rechaza rutas inexistentes o heredadas: %j, %s', (resolver, reference) => {
    expect(() => resolveInternalReference(resolver, reference)).toThrow('No fue posible resolver');
  });
});

describe('external sources', () => {
  it('carga y parsea el archivo referenciado', async () => {
    fs.readFile.mockResolvedValue('{"color":{"$value":"red"}}');

    await expect(loadTokenSource('/tokens', 'color.json')).resolves.toEqual({
      color: { $value: 'red' },
    });

    expect(fs.readFile).toHaveBeenCalledWith('/tokens/color.json', 'utf-8');
  });

  it.each([undefined, 42, '#/sets/base'])('rechaza %s', async (reference) => {
    await expect(loadTokenSource('/tokens', reference)).rejects.toThrow(
      'La referencia externa no es válida',
    );

    expect(fs.readFile).not.toHaveBeenCalled();
  });

  it('incluye contexto cuando el JSON no puede interpretarse', async () => {
    fs.readFile.mockResolvedValue('{');

    await expect(loadTokenSource('/tokens', 'broken.json')).rejects.toThrow(
      'No fue posible interpretar broken.json.',
    );
  });

  it('propaga errores de lectura', async () => {
    const error = new Error('ENOENT');
    fs.readFile.mockRejectedValue(error);

    await expect(loadTokenSource('/tokens', 'missing.json')).rejects.toBe(error);
  });
});

describe('resolution order', () => {
  it('permite que un modifier sobrescriba el set base', async () => {
    fs.readFile
      .mockResolvedValueOnce('{"color":{"$value":"white"}}')
      .mockResolvedValueOnce('{"color":{"$value":"black"}}');

    const resolver = {
      sets: {
        base: { sources: [{ $ref: 'base.json' }] },
      },
      modifiers: {
        scheme: {
          contexts: { dark: [{ $ref: 'dark.json' }] },
        },
      },
      resolutionOrder: [{ $ref: '#/sets/base' }, { $ref: '#/modifiers/scheme' }],
    };

    await expect(resolveOrder(resolver, { scheme: 'dark' }, '/tokens')).resolves.toEqual({
      color: { $value: 'black' },
    });
  });

  it('rechaza referencias no soportadas en el orden', async () => {
    const resolver = {
      resolutionOrder: [{ $ref: '#/unknown/base' }],
    };

    await expect(resolveOrder(resolver, {}, '/tokens')).rejects.toThrow(
      'La referencia en resolutionOrder no está soportada',
    );
  });
});
