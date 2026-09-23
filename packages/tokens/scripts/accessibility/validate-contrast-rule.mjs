import { contrastRatio } from './contrast.mjs';
import { parseHexColor } from './parse-color.mjs';
import { getTokenValue } from '../theme/get-token.mjs';

export function validateContrastRule(tokens, rule) {
  const foregroundValue = getTokenValue(tokens, rule.foreground);
  const backgroundValue = getTokenValue(tokens, rule.background);
  const foreground = parseHexColor(foregroundValue);
  const background = parseHexColor(backgroundValue);
  const ratio = contrastRatio(foreground, background);

  return {
    ...rule,
    foregroundValue,
    backgroundValue,
    ratio,
    valid: ratio >= rule.minimum,
  };
}
