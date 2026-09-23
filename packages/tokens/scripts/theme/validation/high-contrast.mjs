import { CONTRAST_RULES } from '../../accessibility/contrast-rules.mjs';
import { validateContrastRule } from '../../accessibility/validate-contrast-rule.mjs';
import { getTransformedTheme } from '../get-transformed-theme.mjs';

function calculateContrastResults(tokens) {
  return new Map(
    CONTRAST_RULES.map((rule) => {
      const result = validateContrastRule(tokens, rule);

      return [rule.name, result];
    }),
  );
}

function validateResult(name, standardResult, highResult) {
  if (!highResult) {
    throw new Error(
      `No se encontró el resultado de contraste "${name}" para el theme high contrast.`,
    );
  }

  if (highResult.ratio < standardResult.ratio) {
    throw new Error(
      [
        `High contrast empeora "${name}".`,
        `Standard=${standardResult.ratio.toFixed(2)}.`,
        `High=${highResult.ratio.toFixed(2)}.`,
      ].join(' '),
    );
  }
}

export async function validateHighContrast(theme) {
  const standard = await getTransformedTheme({ ...theme, contrast: 'standard' });
  const high = await getTransformedTheme({ ...theme, contrast: 'high' });
  const standardResults = calculateContrastResults(standard.dictionary.tokens);
  const highResults = calculateContrastResults(high.dictionary.tokens);

  for (const [name, standardResult] of standardResults) {
    validateResult(name, standardResult, highResults.get(name));
  }
}
