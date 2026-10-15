import { describe, expect, it, vi } from 'vitest';
import { createStyleDictionary } from '../../scripts/build/create-style-dictionary.mjs';
import { createCssVariableName } from '../../scripts/css/create-css-variable-name.mjs';

vi.mock('../../config/token-config.mjs', () => ({
  TOKEN_CONFIG: Object.freeze({ cssVariablePrefix: 'acme' }),
}));

describe('CSS prefix configuration', () => {
  it('aplica un prefijo alternativo usando Style Dictionary real', async () => {
    const dictionary = createStyleDictionary({
      id: 'prefix-test',
      tokens: {
        motion: {
          duration: {
            fast: { $type: 'duration', $value: { value: 100, unit: 'ms' } },
          },
        },
      },
    });

    const [css] = await dictionary.formatPlatform('css');
    const [json] = await dictionary.formatPlatform('json');
    const [javascript] = await dictionary.formatPlatform('javascript');
    const jsTokens = await import(
      `data:text/javascript;base64,${Buffer.from(javascript.output).toString('base64')}`
    );

    expect(css.output).toContain('--acme-motion-duration-fast: 100ms;');
    expect(css.output).not.toContain('--delaluz-');
    expect(css.output).not.toContain('--motion-duration-fast:');
    expect(createCssVariableName('motion-duration-fast')).toBe('--acme-motion-duration-fast');
    expect(JSON.parse(json.output).motion.duration.fast).toEqual({ value: 100, unit: 'ms' });
    expect(jsTokens.default.motion.duration.fast.$value).toEqual({ value: 100, unit: 'ms' });
    expect(jsTokens.default.motion.duration.fast.name).toBe('MotionDurationFast');
  });
});
