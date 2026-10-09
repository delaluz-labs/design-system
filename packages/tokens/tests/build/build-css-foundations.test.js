import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCssFoundations,
  buildCssFoundations,
} from '../../scripts/build/build-css-foundations.mjs';

const mocks = vi.hoisted(() => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
  config: { cssVariablePrefix: 'delaluz' },
}));
vi.mock('node:fs/promises', () => ({ mkdir: mocks.mkdir, writeFile: mocks.writeFile }));
vi.mock('../../config/token-config.mjs', () => ({ TOKEN_CONFIG: mocks.config }));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.config.cssVariablePrefix = 'delaluz';
  mocks.mkdir.mockResolvedValue(undefined);
  mocks.writeFile.mockResolvedValue(undefined);
});

describe('CSS foundations', () => {
  it.each(['delaluz', 'acme'])('genera los tres bloques con el prefijo %s', (prefix) => {
    mocks.config.cssVariablePrefix = prefix;
    const css = createCssFoundations();
    for (const [selector, scheme] of [
      [':root', 'light'],
      [':root[data-theme-scheme="dark"]', 'dark'],
      [':root[data-theme-scheme="light"]', 'light'],
    ]) {
      expect(css).toContain(
        `${selector} {\n  color-scheme: ${scheme};\n  --${prefix}-foundation-color-scheme: ${scheme};\n}`,
      );
    }
    expect(css.match(/color-scheme:/g)).toHaveLength(6);
    expect(css.endsWith('\n')).toBe(true);
  });

  it('escribe el CSS generado en la ruta esperada', async () => {
    await buildCssFoundations();
    expect(mocks.mkdir).toHaveBeenCalledExactlyOnceWith(
      new URL('../../dist/css/', import.meta.url),
      { recursive: true },
    );
    expect(mocks.writeFile).toHaveBeenCalledExactlyOnceWith(
      new URL('../../dist/css/foundations.css', import.meta.url),
      createCssFoundations(),
      'utf8',
    );
  });

  it('no escribe si falla mkdir', async () => {
    const error = new Error('EACCES');
    mocks.mkdir.mockRejectedValue(error);
    await expect(buildCssFoundations()).rejects.toBe(error);
    expect(mocks.writeFile).not.toHaveBeenCalled();
  });

  it('propaga errores de escritura', async () => {
    const error = new Error('ENOSPC');
    mocks.writeFile.mockRejectedValue(error);
    await expect(buildCssFoundations()).rejects.toBe(error);
  });
});
