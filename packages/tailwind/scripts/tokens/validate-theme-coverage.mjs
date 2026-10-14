import { extractCssVariables } from './extract-css-variables.mjs';

const VALID_SOURCES = new Set(['base', 'theme']);

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
  const errors = [];
  const baseVariables = extractCssVariables(sources.base);
  const themeVariables = sources.themes.map(({ id, css }) => ({
    id,
    variables: extractCssVariables(css),
  }));

  for (const [tailwindName, mapping] of Object.entries(mappings)) {
    if (
      !mapping ||
      !VALID_SOURCES.has(mapping.source) ||
      typeof mapping.token !== 'string' ||
      !/^[a-z][a-z0-9-]*$/.test(mapping.token)
    ) {
      errors.push(`Configuración inválida: ${tailwindName}`);
      continue;
    }

    const variable = `--${prefix}-${mapping.token}`;

    if (mapping.source === 'base') {
      if (!baseVariables.has(variable)) {
        errors.push(`${tailwindName}: falta ${variable} en base.css`);
      }

      continue;
    }

    if (themeVariables.length === 0) {
      errors.push(`${tailwindName}: no se encontraron temas`);
      continue;
    }

    for (const theme of themeVariables) {
      if (!theme.variables.has(variable)) {
        errors.push(`${tailwindName}: falta ${variable} en ${theme.id}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Errores de cobertura de tokens:\n${errors.join('\n')}`);
  }
}
