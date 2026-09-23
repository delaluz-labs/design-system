import { isZeroDuration } from '../../accessibility/is-zero-duration.mjs';
import { getTokenValue } from '../get-token.mjs';
import { getTransformedTheme } from '../get-transformed-theme.mjs';

const MOTION_TOKENS = ['motion.duration.fast', 'motion.duration.normal', 'motion.duration.slow'];

function formatValue(value) {
  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function validateMotionValue(tokens, tokenPath) {
  const value = getTokenValue(tokens, tokenPath);

  if (!isZeroDuration(value)) {
    throw new Error(
      `Reduced motion no neutraliza "${tokenPath}". Valor actual: ${formatValue(value)}.`,
    );
  }
}

export async function validateReducedMotion(theme) {
  const { dictionary } = await getTransformedTheme({ ...theme, motion: 'reduced' });

  for (const tokenPath of MOTION_TOKENS) {
    validateMotionValue(dictionary.tokens, tokenPath);
  }
}
