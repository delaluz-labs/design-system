import { readFile } from 'node:fs/promises';
import { TOKEN_CONFIG } from '../config/token-config.mjs';
import { createThemePermutations } from './theme/create-permutations.mjs';
import { createThemeId } from './theme/create-theme-id.mjs';
import { createThemeSelector } from './theme/create-theme-selector.mjs';

async function validateCssThemes() {
  const permutations = createThemePermutations();
  const entrypoint = await readFile(new URL('../dist/css/index.css', import.meta.url), 'utf-8');
  const errors = [];

  for (const theme of permutations) {
    const id = createThemeId(theme);
    const relativePath = `../themes/${id}/tokens.css`;
    const css = await readFile(new URL(`../dist/themes/${id}/tokens.css`, import.meta.url), 'utf-8');

    if (!css.includes(createThemeSelector(theme))) {
      errors.push(`Selector incorrecto: ${id}`);
    }

    if (!css.includes(`--${TOKEN_CONFIG.cssVariablePrefix}-`)) {
      errors.push(`Prefijo CSS incorrecto: ${id}`);
    }

    if (!entrypoint.includes(`@import '${relativePath}';`)) {
      errors.push(`Theme no incluido en index.css: ${id}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }

  console.log(`${permutations.length} themes CSS validados.`);
}

async function validateCssFoundations() {
  const prefix = `--${TOKEN_CONFIG.cssVariablePrefix}-`;
  const base = await readFile(new URL('../dist/css/base.css', import.meta.url), 'utf-8');
  const foundations = await readFile(new URL('../dist/css/foundations.css', import.meta.url), 'utf-8');
  const entrypoint = await readFile(new URL('../dist/css/index.css', import.meta.url), 'utf-8');

  if (!base.includes(prefix)) {
    throw new Error('Los tokens base no utilizan el prefijo configurado.');
  }

  if (!foundations.includes(prefix)) {
    throw new Error('Foundations no utiliza el prefijo configurado.');
  }

  for (const path of ['./base.css', './foundations.css']) {
    if (!entrypoint.includes(`@import '${path}';`)) {
      throw new Error(`Falta importar ${path} en index.css.`);
    }
  }
}

await validateCssThemes();
await validateCssFoundations();
