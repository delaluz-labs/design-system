import { extractCssVariables } from './extract-css-variables.mjs';

const VALID_SOURCES = new Set(['base', 'theme']);
const TOKEN_PATTERN = /^[a-z][a-z0-9-]*$/;

/**
 * Comprueba que un mapeo tenga una configuración válida.
 *
 * @param {{source: string, token: string} | null | undefined} mapping
 * @returns {boolean}
 */
function isValidMapping(mapping) {
  return (
    mapping !== null &&
    typeof mapping === 'object' &&
    VALID_SOURCES.has(mapping.source) &&
    typeof mapping.token === 'string' &&
    TOKEN_PATTERN.test(mapping.token)
  );
}

/**
 * Extrae las variables CSS de cada tema.
 *
 * @param {Array<{id: string, css: string}>} themes
 * @returns {Array<{id: string, variables: Set<string>}>}
 */
function extractThemeVariables(themes) {
  return themes.map(({ id, css }) => ({
    id,
    variables: extractCssVariables(css),
  }));
}

/**
 * Comprueba la existencia de un token en los estilos base.
 *
 * @param {string} name
 * @param {string} variable
 * @param {Set<string>} baseVariables
 * @returns {string[]}
 */
function validateBaseToken(name, variable, baseVariables) {
  if (baseVariables.has(variable)) {
    return [];
  }

  return [`${name}: falta ${variable} en base.css`];
}

/**
 * Comprueba que un token exista en todos los temas.
 *
 * @param {string} name
 * @param {string} variable
 * @param {Array<{id: string, variables: Set<string>}>} themes
 * @returns {string[]}
 */
function validateThemeToken(name, variable, themes) {
  if (themes.length === 0) {
    return [`${name}: no se encontraron temas`];
  }

  return themes
    .filter(({ variables }) => !variables.has(variable))
    .map(({ id }) => `${name}: falta ${variable} en ${id}`);
}

/**
 * Valida un mapeo según su origen.
 *
 * @param {string} name
 * @param {{source: string, token: string}} mapping
 * @param {string} prefix
 * @param {Set<string>} baseVariables
 * @param {Array<{id: string, variables: Set<string>}>} themes
 * @returns {string[]}
 */
function validateMapping(name, mapping, prefix, baseVariables, themes) {
  if (!isValidMapping(mapping)) {
    return [`Configuración inválida: ${name}`];
  }

  const variable = `--${prefix}-${mapping.token}`;

  if (mapping.source === 'base') {
    return validateBaseToken(name, variable, baseVariables);
  }

  return validateThemeToken(name, variable, themes);
}

/**
 * Valida que cada variable requerida exista
 * en su origen correspondiente.
 *
 * @param {Record<string, {source: string, token: string}>} mappings
 * @param {{
 *   base: string,
 *   themes: Array<{id: string, css: string}>
 * }} sources
 * @param {string} prefix
 * @returns {void}
 */
export function validateThemeCoverage(mappings, sources, prefix) {
  const baseVariables = extractCssVariables(sources.base);
  const themes = extractThemeVariables(sources.themes);

  const errors = Object.entries(mappings).flatMap(([name, mapping]) =>
    validateMapping(name, mapping, prefix, baseVariables, themes),
  );

  if (errors.length > 0) {
    throw new Error(`Errores de cobertura de tokens:\n${errors.join('\n')}`);
  }
}
