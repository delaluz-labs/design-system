import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildCssEntrypoint } from '../../scripts/build/build-css-entrypoint.mjs';

const fs = vi.hoisted(() => ({ readFile: vi.fn(), mkdir: vi.fn(), writeFile: vi.fn() }));
vi.mock('node:fs/promises', () => fs);
vi.mock('../../scripts/theme/create-permutations.mjs', () => ({
  createThemePermutations: () =>
    ['light', 'dark'].map((scheme) => ({
      brand: 'delaluz',
      scheme,
      contrast: 'standard',
      motion: 'standard',
    })),
}));
const directory = new URL('../../dist/css/', import.meta.url);
const paths = [
  './base.css',
  '../themes/delaluz-light-standard-standard/tokens.css',
  '../themes/delaluz-dark-standard-standard/tokens.css',
  './foundations.css',
];

beforeEach(() => {
  vi.resetAllMocks();
  fs.readFile.mockResolvedValue('');
  fs.mkdir.mockResolvedValue(undefined);
  fs.writeFile.mockResolvedValue(undefined);
});

describe('buildCssEntrypoint', () => {
  it('verifica todos los archivos y escribe los imports en orden', async () => {
    fs.mkdir.mockImplementation(async () => {
      expect(fs.readFile).toHaveBeenCalledTimes(paths.length);
    });
    await buildCssEntrypoint();
    expect(fs.readFile.mock.calls).toEqual(paths.map((path) => [new URL(path, directory), 'utf8']));
    expect(fs.mkdir).toHaveBeenCalledExactlyOnceWith(directory, { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledExactlyOnceWith(
      new URL('index.css', directory),
      paths.map((path) => `@import '${path}';`).join('\n') + '\n',
      'utf8',
    );
  });

  it.each(paths)('no escribe si falta %s', async (missing) => {
    const error = new Error('ENOENT');
    fs.readFile.mockImplementation(async (url) => {
      if (url.href === new URL(missing, directory).href) throw error;
      return '';
    });
    await expect(buildCssEntrypoint()).rejects.toBe(error);
    expect(fs.mkdir).not.toHaveBeenCalled();
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('no escribe si falla mkdir', async () => {
    const error = new Error('EACCES');
    fs.mkdir.mockRejectedValue(error);
    await expect(buildCssEntrypoint()).rejects.toBe(error);
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('propaga errores de escritura', async () => {
    const error = new Error('ENOSPC');
    fs.writeFile.mockRejectedValue(error);
    await expect(buildCssEntrypoint()).rejects.toBe(error);
  });
});
