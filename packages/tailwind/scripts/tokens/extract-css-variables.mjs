/**
 * Extrae los nombres de Custom Properties declaradas en CSS.
 *
 * Está diseñado para los archivos CSS generados
 * por Style Dictionary.
 *
 * @param {string} css
 * @returns {Set<string>}
 */
export function extractCssVariables(css) {
  const variables = new Set();
  const content = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const expression = /(?:^|[;{}\n\r])\s*(--[a-zA-Z_][\w-]*)\s*:/g;

  for (const match of content.matchAll(expression)) {
    variables.add(match[1]);
  }

  return variables;
}

/**
 * Combina las variables encontradas en varios archivos.
 *
 * @param {string[]} sources
 * @returns {Set<string>}
 */
export function collectCssVariables(sources) {
  const variables = new Set();

  for (const source of sources) {
    for (const variable of extractCssVariables(source)) {
      variables.add(variable);
    }
  }

  return variables;
}
