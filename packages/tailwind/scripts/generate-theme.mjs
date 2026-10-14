/**
 * Genera declaraciones de Tailwind CSS 4 a partir de un mapa explícito de variables.
 *
 * @param {Record<string, string>} mappings
 * @returns {string}
 */
export function generateTailwindTheme(mappings) {
  const declarations = Object.entries(mappings).map(([name, cssVariable]) => {
    if (!/^--[a-z][a-z0-9-]*$/.test(cssVariable)) {
      throw new TypeError(`Variable CSS inválida para "${name}": ${cssVariable}`);
    }

    if (!/^--(?:color|font|radius|shadow|spacing|text|tracking|leading)-[a-z0-9-]+$/.test(name)) {
      throw new TypeError(`Variable Tailwind inválida: ${name}`);
    }

    return `  ${name}: var(${cssVariable});`;
  });

  return ['@theme inline {', ...declarations, '}', ''].join('\n');
}
