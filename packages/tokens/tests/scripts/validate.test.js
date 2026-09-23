import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const fs = vi.hoisted(() => ({
  readdir: vi.fn(),
  readFile: vi.fn(),
}));

vi.mock('node:fs/promises', () => fs);

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();

  fs.readdir.mockResolvedValue(['example.tokens.json', 'README.md']);
  fs.readFile.mockResolvedValue('{"color": {}}');

  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('validate tokens', () => {
  it('valida tokens de las tres carpetas e ignora otros archivos', async () => {
    await import('../../scripts/validate.mjs');

    expect(fs.readdir.mock.calls).toEqual([['src/primitive'], ['src/semantic'], ['src/component']]);

    expect(fs.readFile).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith('Tokens válidos: 3 archivos analizados.');
  });

  it('rechaza una colección sin archivos de tokens', async () => {
    fs.readdir.mockResolvedValue(['README.md']);

    await expect(import('../../scripts/validate.mjs')).rejects.toThrow(
      'No se encontraron archivos de tokens.',
    );

    expect(fs.readFile).not.toHaveBeenCalled();
  });

  it('rechaza JSON inválido', async () => {
    fs.readFile.mockResolvedValue('{');

    await expect(import('../../scripts/validate.mjs')).rejects.toBeInstanceOf(SyntaxError);
  });

  it('propaga los errores de lectura', async () => {
    const error = new Error('No fue posible leer el archivo');
    fs.readFile.mockRejectedValue(error);

    await expect(import('../../scripts/validate.mjs')).rejects.toBe(error);
  });
});
