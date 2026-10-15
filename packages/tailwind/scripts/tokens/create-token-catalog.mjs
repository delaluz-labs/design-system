import { collectCssVariables } from './extract-css-variables.mjs';

/**
 * Clasifica una variable CSS por su nombre.
 * La clasificación es informativa, no semántica.
 *
 * @param {string} variable
 * @param {string} prefix
 * @returns {string}
 */
export function classifyToken(variable, prefix) {
  const name = variable.startsWith(`--${prefix}-`)
    ? variable.slice(prefix.length + 3)
    : variable.replace(/^--/, '');
  const categories = [
    'color',
    'spacing',
    'radius',
    'typography',
    'font',
    'shadow',
    'duration',
    'motion',
    'opacity',
    'size',
    'border',
  ];

  return (
    categories.find((category) => name === category || name.startsWith(`${category}-`)) ?? 'other'
  );
}

/**
 * Construye un catálogo ordenado de variables CSS.
 *
 * @param {string[]} cssSources
 * @param {string} prefix
 * @returns {{ prefix: string, total: number, tokens: Array<{name: string, category: string}> }}
 */
export function createTokenCatalog(cssSources, prefix) {
  if (!/^[a-z][a-z0-9-]*$/.test(prefix)) {
    throw new TypeError(`Prefijo CSS inválido: ${prefix}`);
  }

  const variables = collectCssVariables(cssSources);

  const tokens = [...variables]
    .filter((name) => name.startsWith(`--${prefix}-`))
    .sort()
    .map((name) => ({
      name,
      category: classifyToken(name, prefix),
    }));

  return {
    prefix,
    total: tokens.length,
    tokens,
  };
}
