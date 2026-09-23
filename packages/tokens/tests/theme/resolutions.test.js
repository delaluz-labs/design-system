import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateThemeResolutions } from '../../scripts/theme/validation/resolutions.mjs';

const mocks = vi.hoisted(() => ({
  permutations: vi.fn(),
  resolveThemeTokens: vi.fn(),
}));

vi.mock('../../scripts/theme/create-permutations.mjs', () => ({
  createThemePermutations: mocks.permutations,
}));

vi.mock('../../scripts/theme/resolver/resolve-theme.mjs', () => ({
  resolveThemeTokens: mocks.resolveThemeTokens,
}));

const themes = ['light', 'dark'].map((scheme) => ({
  brand: 'delaluz',
  scheme,
  contrast: 'standard',
  motion: 'standard',
}));

beforeEach(() => {
  vi.resetAllMocks();

  mocks.permutations.mockReturnValue(themes);
  mocks.resolveThemeTokens.mockResolvedValue({
    tokens: {
      color: { $value: '#ffffff' },
    },
  });
});

describe('validateThemeResolutions', () => {
  it('resuelve cada combinación y devuelve la cantidad validada', async () => {
    await expect(validateThemeResolutions()).resolves.toBe(2);

    expect(mocks.resolveThemeTokens.mock.calls).toEqual(themes.map((theme) => [theme]));
  });

  it.each([
    ['ausente', undefined],
    ['nulo', null],
    ['vacío', {}],
  ])('rechaza un árbol de tokens %s', async (_name, tokens) => {
    mocks.resolveThemeTokens.mockResolvedValueOnce({ tokens });

    await expect(validateThemeResolutions()).rejects.toThrow(
      'La resolución produjo un árbol de tokens vacío.',
    );

    expect(mocks.resolveThemeTokens).toHaveBeenCalledTimes(1);
  });

  it('también valida las combinaciones posteriores a la primera', async () => {
    mocks.resolveThemeTokens
      .mockResolvedValueOnce({
        tokens: { color: { $value: '#ffffff' } },
      })
      .mockResolvedValueOnce({ tokens: {} });

    await expect(validateThemeResolutions()).rejects.toThrow(
      'La resolución produjo un árbol de tokens vacío.',
    );

    expect(mocks.resolveThemeTokens).toHaveBeenCalledTimes(2);
  });

  it('propaga errores del resolver', async () => {
    const error = new Error('Referencia de tokens inexistente');
    mocks.resolveThemeTokens.mockRejectedValueOnce(error);

    await expect(validateThemeResolutions()).rejects.toBe(error);

    expect(mocks.resolveThemeTokens).toHaveBeenCalledTimes(1);
  });

  it('devuelve cero cuando no hay combinaciones', async () => {
    mocks.permutations.mockReturnValue([]);

    await expect(validateThemeResolutions()).resolves.toBe(0);

    expect(mocks.resolveThemeTokens).not.toHaveBeenCalled();
  });
});
