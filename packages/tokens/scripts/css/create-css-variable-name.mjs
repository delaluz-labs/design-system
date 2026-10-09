import { TOKEN_CONFIG } from '../../config/token-config.mjs';

export function createCssVariableName(tokenName) {
  if (typeof tokenName !== 'string' || tokenName.length === 0) {
    throw new TypeError('El nombre del token debe ser una cadena no vacía.');
  }

  return `--${TOKEN_CONFIG.cssVariablePrefix}-${tokenName}`;
}
