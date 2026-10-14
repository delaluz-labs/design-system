import { TOKEN_CONFIG } from '../../../tokens/config/token-config.mjs';
import { readGeneratedTokenCssByTheme } from './read-generated-token-css.mjs';
import { extractCssVariables } from './extract-css-variables.mjs';

const { base, themes } = await readGeneratedTokenCssByTheme();
const prefix = `--${TOKEN_CONFIG.cssVariablePrefix}-`;
const baseVariables = extractCssVariables(base);
const themeVariables = themes.map(({ id, css }) => ({ id, variables: extractCssVariables(css) }));
const allVariables = new Set([
  ...baseVariables,
  ...themeVariables.flatMap(({ variables }) => [...variables]),
]);
const report = [...allVariables]
  .filter((variable) => variable.startsWith(prefix))
  .sort()
  .map((variable) => {
    const inBase = baseVariables.has(variable);

    const availableThemes = themeVariables
      .filter(({ variables }) => variables.has(variable))
      .map(({ id }) => id);

    const source = inBase
      ? 'base'
      : availableThemes.length === themes.length && themes.length > 0
        ? 'theme'
        : 'incomplete';

    return {
      variable,
      token: variable.slice(prefix.length),
      source,
      coverage: `${availableThemes.length}/${themes.length}`,
    };
  });

console.table(report);
