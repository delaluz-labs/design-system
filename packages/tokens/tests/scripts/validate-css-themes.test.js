import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ readFile: vi.fn() }));
vi.mock('node:fs/promises', () => mocks);
vi.mock('../../config/token-config.mjs', () => ({ TOKEN_CONFIG: { cssVariablePrefix: 'acme' } }));
vi.mock('../../scripts/theme/create-permutations.mjs', () => ({
  createThemePermutations: () =>
    ['light', 'dark'].map((scheme) => ({
      brand: 'delaluz',
      scheme,
      contrast: 'standard',
      motion: 'standard',
    })),
}));
const root = new URL('../../dist/', import.meta.url);
const ids = ['delaluz-light-standard-standard', 'delaluz-dark-standard-standard'];
let files;
const load = () => import('../../scripts/validate-css-themes.mjs');

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  files = new Map(
    [
      [
        'css/index.css',
        [
          "@import './base.css';",
          ...ids.map((id) => `@import '../themes/${id}/tokens.css';`),
          "@import './foundations.css';",
        ].join('\n'),
      ],
      ['css/base.css', ':root { --acme-spacing: 4px; }'],
      ['css/foundations.css', ':root { --acme-foundation-color-scheme: light; }'],
      ...['light', 'dark'].map((scheme, index) => [
        `themes/${ids[index]}/tokens.css`,
        `:root[data-theme-brand="delaluz"][data-theme-scheme="${scheme}"][data-theme-contrast="standard"][data-theme-motion="standard"] { --acme-color: red; }`,
      ]),
    ].map(([path, content]) => [new URL(path, root).href, content]),
  );
  mocks.readFile.mockImplementation(async (url) => {
    if (!files.has(url.href)) throw new Error(`Archivo inexistente: ${url.href}`);
    return files.get(url.href);
  });
});
afterEach(() => vi.restoreAllMocks());

function replace(path, oldText, newText) {
  const key = new URL(path, root).href;
  files.set(key, files.get(key).replace(oldText, newText));
}

describe('validate CSS themes', () => {
  it('acepta los temas, base y foundations e informa la cantidad', async () => {
    await load();
    expect(console.log).toHaveBeenCalledExactlyOnceWith('2 themes CSS validados.');
    expect(mocks.readFile).toHaveBeenCalledWith(new URL('css/base.css', root), 'utf-8');
    expect(mocks.readFile).toHaveBeenCalledWith(new URL('css/foundations.css', root), 'utf-8');
  });

  it.each([
    ['selector', ':root', '.invalid', 'Selector incorrecto'],
    ['prefijo', '--acme-', '--wrong-', 'Prefijo CSS incorrecto'],
  ])('rechaza %s incorrecto', async (_name, from, to, message) => {
    replace(`themes/${ids[0]}/tokens.css`, from, to);
    await expect(load()).rejects.toThrow(`${message}: ${ids[0]}`);
  });

  it('rechaza un theme sin import', async () => {
    replace('css/index.css', `@import '../themes/${ids[0]}/tokens.css';`, '');
    await expect(load()).rejects.toThrow(`Theme no incluido en index.css: ${ids[0]}`);
  });

  it('acumula errores de varios temas', async () => {
    replace(`themes/${ids[0]}/tokens.css`, ':root', '.invalid');
    replace(`themes/${ids[1]}/tokens.css`, '--acme-', '--wrong-');
    replace('css/index.css', `@import '../themes/${ids[1]}/tokens.css';`, '');
    await expect(load()).rejects.toThrow(
      [
        `Selector incorrecto: ${ids[0]}`,
        `Prefijo CSS incorrecto: ${ids[1]}`,
        `Theme no incluido en index.css: ${ids[1]}`,
      ].join('\n'),
    );
  });

  it.each([
    ['base', 'Los tokens base no utilizan el prefijo configurado.'],
    ['foundations', 'Foundations no utiliza el prefijo configurado.'],
  ])('rechaza %s con prefijo incorrecto', async (name, message) => {
    replace(`css/${name}.css`, '--acme-', '--wrong-');
    await expect(load()).rejects.toThrow(message);
  });

  it.each(['base', 'foundations'])('rechaza la falta del import de %s', async (name) => {
    replace('css/index.css', `@import './${name}.css';`, '');
    await expect(load()).rejects.toThrow(`Falta importar ./${name}.css en index.css.`);
  });

  it.each(['css/index.css', `themes/${ids[0]}/tokens.css`, 'css/base.css', 'css/foundations.css'])(
    'propaga errores de lectura de %s',
    async (path) => {
      const error = new Error('EACCES');
      const original = mocks.readFile.getMockImplementation();
      mocks.readFile.mockImplementation(async (url, encoding) => {
        if (url.href === new URL(path, root).href) throw error;
        return original(url, encoding);
      });
      await expect(load()).rejects.toBe(error);
    },
  );
});
