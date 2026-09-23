import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  readFile: vi.fn(),
  access: vi.fn(),
  permutations: vi.fn(),
  resolutions: vi.fn(),
}));

vi.mock('node:fs/promises', () => ({
  readFile: mocks.readFile,
  access: mocks.access,
}));

vi.mock('../../scripts/theme/create-permutations.mjs', () => ({
  createThemePermutations: mocks.permutations,
}));

vi.mock('../../scripts/theme/validation/resolutions.mjs', () => ({
  validateThemeResolutions: mocks.resolutions,
}));

function createResolver() {
  const names = ['brand', 'scheme', 'contrast', 'motion'];

  return {
    version: '2025.10',
    sets: {
      base: {
        sources: [{ $ref: 'primitive/color.tokens.json' }],
      },
    },
    modifiers: Object.fromEntries(
      names.map((name) => [
        name,
        {
          default: 'standard',
          contexts: { standard: [] },
        },
      ]),
    ),
    resolutionOrder: [
      { $ref: '#/sets/base' },
      ...names.map((name) => ({ $ref: `#/modifiers/${name}` })),
    ],
  };
}

const theme = {
  brand: 'delaluz',
  scheme: 'light',
  contrast: 'standard',
  motion: 'standard',
};

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();

  mocks.readFile.mockResolvedValue(JSON.stringify(createResolver()));
  mocks.access.mockResolvedValue(undefined);
  mocks.permutations.mockReturnValue([theme]);
  mocks.resolutions.mockResolvedValue(1);

  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('validate theme resolver', () => {
  it('acepta un resolver válido y verifica los archivos externos', async () => {
    await import('../../scripts/validate-themes.mjs');

    expect(mocks.access).toHaveBeenCalledWith(
      expect.stringContaining('primitive/color.tokens.json'),
    );
    expect(mocks.resolutions).toHaveBeenCalledOnce();
    expect(console.log).toHaveBeenCalledWith(
      'Theme Resolver válido. 1 combinaciones verificadas. 1 resoluciones verificadas.',
    );
  });

  it.each([
    [
      'versión incorrecta',
      (r) => {
        r.version = '2024.01';
      },
      /versión/,
    ],
    [
      'versión ausente',
      (r) => {
        delete r.version;
      },
      /versión/,
    ],
    [
      'sets ausentes',
      (r) => {
        delete r.sets;
      },
      /declarar "sets"/,
    ],
    [
      'sets inválidos',
      (r) => {
        r.sets = 'invalid';
      },
      /declarar "sets"/,
    ],
    [
      'sets vacíos',
      (r) => {
        r.sets = {};
      },
      /al menos un set/,
    ],
    [
      'sources inválidos',
      (r) => {
        r.sets.base.sources = null;
      },
      /arreglo "sources"/,
    ],
    [
      'sources vacíos',
      (r) => {
        r.sets.base.sources = [];
      },
      /no contiene sources/,
    ],
    [
      'modifiers ausentes',
      (r) => {
        delete r.modifiers;
      },
      /declarar "modifiers"/,
    ],
    [
      'modifiers inválidos',
      (r) => {
        r.modifiers = 'invalid';
      },
      /declarar "modifiers"/,
    ],
    [
      'modifier requerido ausente',
      (r) => {
        delete r.modifiers.brand;
      },
      /modifier requerido/,
    ],
    [
      'contexts ausentes',
      (r) => {
        delete r.modifiers.brand.contexts;
      },
      /declarar "contexts"/,
    ],
    [
      'contexts inválidos',
      (r) => {
        r.modifiers.brand.contexts = 'invalid';
      },
      /declarar "contexts"/,
    ],
    [
      'contexts vacíos',
      (r) => {
        r.modifiers.brand.contexts = {};
      },
      /no contiene contexts/,
    ],
    [
      'default ausente',
      (r) => {
        delete r.modifiers.brand.default;
      },
      /contexto default/,
    ],
    [
      'default desconocido',
      (r) => {
        r.modifiers.brand.default = 'missing';
      },
      /no existe/,
    ],
    [
      'sources de contexto inválidos',
      (r) => {
        r.modifiers.brand.contexts.standard = {};
      },
      /debe ser un arreglo/,
    ],
    [
      'orden ausente',
      (r) => {
        delete r.resolutionOrder;
      },
      /declarar "resolutionOrder"/,
    ],
    [
      'orden vacío',
      (r) => {
        r.resolutionOrder = [];
      },
      /no puede estar vacío/,
    ],
    [
      'entrada nula',
      (r) => {
        r.resolutionOrder = [null];
      },
      /declarar "\$ref"/,
    ],
    [
      'referencia inválida',
      (r) => {
        r.resolutionOrder = [{ $ref: 1 }];
      },
      /declarar "\$ref"/,
    ],
    [
      'modifier omitido del orden',
      (r) => {
        r.resolutionOrder.pop();
      },
      /no contiene/,
    ],
  ])('rechaza %s', async (_name, mutate, message) => {
    const resolver = createResolver();
    mutate(resolver);
    mocks.readFile.mockResolvedValue(JSON.stringify(resolver));

    await expect(import('../../scripts/validate-themes.mjs')).rejects.toThrow(message);
  });

  it('explica el error cuando el JSON no es válido', async () => {
    mocks.readFile.mockResolvedValue('{');

    await expect(import('../../scripts/validate-themes.mjs')).rejects.toThrow(
      'El archivo JSON no es válido',
    );
  });

  it('rechaza referencias a archivos inexistentes', async () => {
    mocks.access.mockRejectedValue(new Error('ENOENT'));

    await expect(import('../../scripts/validate-themes.mjs')).rejects.toThrow(
      'No existe el archivo referenciado',
    );
  });

  it.each([
    ['ninguna combinación', [], /No se generaron combinaciones/],
    ['combinaciones duplicadas', [theme, theme], /duplicadas/],
    [
      'más de 100 combinaciones',
      Array.from({ length: 101 }, (_, index) => ({
        ...theme,
        brand: `brand-${index}`,
      })),
      /máximo permitido/,
    ],
  ])('rechaza %s', async (_name, permutations, message) => {
    mocks.permutations.mockReturnValue(permutations);

    await expect(import('../../scripts/validate-themes.mjs')).rejects.toThrow(message);
  });

  it('propaga los errores al resolver los themes', async () => {
    const error = new Error('Resolución inválida');
    mocks.resolutions.mockRejectedValue(error);

    await expect(import('../../scripts/validate-themes.mjs')).rejects.toBe(error);
  });
});
