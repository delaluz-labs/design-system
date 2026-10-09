import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ build: vi.fn() }));
vi.mock('../../scripts/build/build-css-entrypoint.mjs', () => ({
  buildCssEntrypoint: mocks.build,
}));
beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('run CSS entrypoint', () => {
  it('espera al build antes de informar éxito', async () => {
    mocks.build.mockImplementation(async () => {
      await Promise.resolve();
      expect(console.log).not.toHaveBeenCalled();
    });
    await import('../../scripts/build/run-css-entrypoint.mjs');
    expect(mocks.build).toHaveBeenCalledExactlyOnceWith();
    expect(console.log).toHaveBeenCalledExactlyOnceWith('Entrypoint CSS generado correctamente.');
  });

  it('propaga errores sin informar éxito', async () => {
    const error = new Error('Build fallido');
    mocks.build.mockRejectedValue(error);
    await expect(import('../../scripts/build/run-css-entrypoint.mjs')).rejects.toBe(error);
    expect(mocks.build).toHaveBeenCalledOnce();
    expect(console.log).not.toHaveBeenCalled();
  });
});
