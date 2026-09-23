import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { buildBase } from '../../scripts/build/build-base.mjs';
import { buildThemes } from '../../scripts/build/build-themes.mjs';
import { buildThemeManifest } from '../../scripts/build/build-manifest.mjs';

const mocks = vi.hoisted(() => ({
  dictionary: vi.fn(),
  buildAllPlatforms: vi.fn(),
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  permutations: vi.fn(),
  resolveThemeTokens: vi.fn(),
}));

vi.mock('style-dictionary', () => ({
  default: mocks.dictionary,
}));

vi.mock('node:fs/promises', () => ({
  mkdir: mocks.mkdir,
  writeFile: mocks.writeFile,
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

  mocks.dictionary.mockImplementation(function () {
    return { buildAllPlatforms: mocks.buildAllPlatforms };
  });
  mocks.buildAllPlatforms.mockResolvedValue(undefined);
  mocks.mkdir.mockResolvedValue(undefined);
  mocks.writeFile.mockResolvedValue(undefined);
  mocks.permutations.mockReturnValue(themes);
  mocks.resolveThemeTokens.mockImplementation(async (theme) => ({
    tokens: { scheme: { $value: theme.scheme } },
  }));

  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('build', () => {
  it('configura y genera los artefactos base', async () => {
    await buildBase();

    const [config] = mocks.dictionary.mock.calls[0];

    expect(config.source).toEqual([
      'src/primitive/spacing.tokens.json',
      'src/primitive/radius.tokens.json',
      'src/primitive/typography.tokens.json',
    ]);
    expect(config.platforms.css.buildPath).toBe('dist/css/');
    expect(config.platforms.json.buildPath).toBe('dist/json/');
    expect(mocks.buildAllPlatforms).toHaveBeenCalledOnce();
  });

  it('genera cada theme con sus tokens, ruta y selector propios', async () => {
    await buildThemes();

    expect(mocks.resolveThemeTokens.mock.calls).toEqual(themes.map((theme) => [theme]));
    expect(mocks.buildAllPlatforms).toHaveBeenCalledTimes(2);

    const configs = mocks.dictionary.mock.calls.map(([config]) => config);

    for (const [index, config] of configs.entries()) {
      const scheme = themes[index].scheme;
      const id = `delaluz-${scheme}-standard-standard`;

      expect(config.tokens).toEqual({ scheme: { $value: scheme } });
      expect(Object.keys(config.platforms)).toEqual(['css', 'json', 'javascript']);
      expect(config.platforms.css.buildPath).toBe(`dist/themes/${id}/`);
      expect(config.platforms.css.files[0].options.selector).toBe(`[data-theme-id="${id}"]`);
    }
  });

  it('escribe un manifiesto con defaults y todos los themes', async () => {
    await buildThemeManifest();

    expect(mocks.mkdir).toHaveBeenCalledWith('dist/json', { recursive: true });

    const [path, content, encoding] = mocks.writeFile.mock.calls[0];

    expect(path).toBe('dist/json/theme-manifest.json');
    expect(encoding).toBe('utf-8');
    expect(content.endsWith('\n')).toBe(true);
    expect(JSON.parse(content)).toEqual({
      version: 1,
      defaults: {
        brand: 'delaluz',
        scheme: 'light',
        contrast: 'standard',
        motion: 'standard',
      },
      themes: themes.map((theme) => ({
        id: `delaluz-${theme.scheme}-standard-standard`,
        ...theme,
      })),
    });
  });

  it('propaga errores de generación', async () => {
    const error = new Error('Falló Style Dictionary');
    mocks.buildAllPlatforms.mockRejectedValue(error);

    await expect(buildBase()).rejects.toBe(error);
    await expect(buildThemes()).rejects.toBe(error);
  });

  it('propaga errores al escribir el manifiesto', async () => {
    const error = new Error('No se pudo escribir el manifiesto');
    mocks.writeFile.mockRejectedValue(error);

    await expect(buildThemeManifest()).rejects.toBe(error);
  });
});
