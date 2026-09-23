import { describe, expect, it } from 'vitest';
import { validateContrastRule } from '../../scripts/accessibility/validate-contrast-rule.mjs';

function createTokens(foreground, background) {
  return {
    semantic: {
      color: {
        text: {
          primary: {
            $value: foreground,
          },
        },

        background: {
          default: {
            $value: background,
          },
        },
      },
    },
  };
}

const RULE = {
  name: 'Texto principal',
  foreground: 'semantic.color.text.primary',
  background: 'semantic.color.background.default',
  minimum: 4.5,
};

describe('validateContrastRule', () => {
  it('debe aprobar negro sobre blanco', () => {
    const tokens = createTokens('#000000', '#ffffff');
    const result = validateContrastRule(tokens, RULE);

    expect(result.valid).toBe(true);
    expect(result.ratio).toBeCloseTo(21, 5);
  });

  it('debe rechazar colores sin contraste', () => {
    const tokens = createTokens('#ffffff', '#ffffff');
    const result = validateContrastRule(tokens, RULE);

    expect(result.valid).toBe(false);
    expect(result.ratio).toBeCloseTo(1, 5);
  });

  it('debe conservar los valores evaluados', () => {
    const tokens = createTokens('#000000', '#ffffff');
    const result = validateContrastRule(tokens, RULE);

    expect(result.foregroundValue).toBe('#000000');
    expect(result.backgroundValue).toBe('#ffffff');
  });

  it('debe fallar cuando no existe el foreground', () => {
    const tokens = {};

    expect(() => validateContrastRule(tokens, RULE)).toThrow('No se encontró el token');
  });
});
