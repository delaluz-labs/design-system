/**
 * Comprueba que las variables utilizadas por Tailwind
 * estén declaradas en los tokens generados.
 *
 * @param {Record<string, string>} mappings
 * @param {Set<string>} availableVariables
 * @returns {void}
 */
export function validateTokenMappings(mappings, availableVariables) {
  const missing = Object.entries(mappings).filter(
    ([, variable]) => !availableVariables.has(variable),
  );

  if (missing.length === 0) {
    return;
  }

  const details = missing.map(([name, variable]) => `- ${name} requiere ${variable}`).join('\n');

  throw new Error(`Se encontraron tokens CSS inexistentes:\n${details}`);
}
