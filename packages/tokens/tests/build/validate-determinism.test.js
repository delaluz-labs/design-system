import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  hashDirectory: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  execFileSync: mocks.execFileSync,
}));

vi.mock('../../scripts/build/hash-directory.mjs', () => ({
  hashDirectory: mocks.hashDirectory,
}));

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();

  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('build determinism', () => {
  it('acepta dos builds con el mismo hash', async () => {
    mocks.hashDirectory.mockResolvedValue('same-hash');

    await import('../../scripts/build/validate-determinism.mjs');

    expect(mocks.execFileSync).toHaveBeenCalledTimes(2);
    expect(mocks.execFileSync).toHaveBeenCalledWith('npm', ['run', 'build:tokens'], {
      stdio: 'inherit',
    });
    expect(mocks.hashDirectory.mock.calls).toEqual([['dist'], ['dist']]);
    expect(console.log).toHaveBeenCalledWith('Build determinista: same-hash');
  });

  it('rechaza builds con hashes diferentes', async () => {
    mocks.hashDirectory.mockResolvedValueOnce('first').mockResolvedValueOnce('second');

    await expect(import('../../scripts/build/validate-determinism.mjs')).rejects.toThrow(
      'El build no es determinista',
    );
  });

  it('interrumpe la validación si falla el build', async () => {
    const error = new Error('Build fallido');
    mocks.execFileSync.mockImplementation(() => {
      throw error;
    });

    await expect(import('../../scripts/build/validate-determinism.mjs')).rejects.toBe(error);

    expect(mocks.hashDirectory).not.toHaveBeenCalled();
  });
});
