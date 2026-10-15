import { describe, expect, it } from 'vitest';
import { createStyleDictionary } from '../../scripts/build/create-style-dictionary.mjs';
import { createThemePermutations } from '../../scripts/theme/create-permutations.mjs';
import { createThemeId } from '../../scripts/theme/create-theme-id.mjs';
import { resolveThemeTokens } from '../../scripts/theme/resolver/resolve-theme.mjs';
import { createCssVariableName } from '../../scripts/css/create-css-variable-name.mjs';

describe('motion output', () => {
  it('genera valores resueltos para aliases semánticos sin referencias CSS', async () => {
    const dictionary = createStyleDictionary({
      id: 'resolved-alias-test',
      tokens: {
        motion: {
          duration: {
            fast: { $type: 'duration', $value: { value: 100, unit: 'ms' } },
          },
        },
        semantic: {
          motion: {
            duration: {
              fast: { $type: 'duration', $value: '{motion.duration.fast}' },
            },
          },
        },
      },
    });

    const [css] = await dictionary.formatPlatform('css');

    expect(css.output).toContain(`${createCssVariableName('motion-duration-fast')}: 100ms;`);
    expect(css.output).toContain(
      `${createCssVariableName('semantic-motion-duration-fast')}: 100ms;`,
    );
    expect(css.output).not.toContain('var(');
    expect(css.output).not.toContain('{motion.duration.fast}');
    expect(css.output).not.toContain('[object Object]');
  });

  it('genera segundos decimales en CSS con Style Dictionary real', async () => {
    const dictionary = createStyleDictionary({
      id: 'duration-test',
      tokens: {
        motion: {
          duration: {
            fast: {
              $type: 'duration',
              $value: { value: 0.5, unit: 's' },
            },
          },
        },
      },
    });
    const [file] = await dictionary.formatPlatform('css');

    expect(file.output).toContain(`${createCssVariableName('motion-duration-fast')}: 0.5s;`);
    expect(file.output.trimStart().startsWith(':root {')).toBe(true);
  });

  it.each(createThemePermutations())('genera motion para %j', async (theme) => {
    const id = createThemeId(theme);
    const { tokens } = await resolveThemeTokens(theme);
    const originalTokens = structuredClone(tokens);
    const dictionary = createStyleDictionary({ id, tokens, theme });
    const [css] = await dictionary.formatPlatform('css');
    const [json] = await dictionary.formatPlatform('json');
    const [javascript] = await dictionary.formatPlatform('javascript');
    const jsonTokens = JSON.parse(json.output);
    const jsTokens = await import(
      `data:text/javascript;base64,${Buffer.from(javascript.output).toString('base64')}`
    );

    expect(css.output).not.toContain('[object Object]');
    const selector =
      `:root[data-theme-brand="${theme.brand}"]` +
      `[data-theme-scheme="${theme.scheme}"]` +
      `[data-theme-contrast="${theme.contrast}"]` +
      `[data-theme-motion="${theme.motion}"]`;
    expect(css.output.trimStart().startsWith(`${selector} {`)).toBe(true);
    for (const [name, standard] of [
      ['fast', 100],
      ['normal', 200],
      ['slow', 300],
    ]) {
      const value = theme.motion === 'reduced' ? 0 : standard;
      expect(css.output).toContain(
        `${createCssVariableName(`motion-duration-${name}`)}: ${value}ms;`,
      );
      expect(jsonTokens.motion.duration[name]).toEqual({ value, unit: 'ms' });
      expect(jsTokens.default.motion.duration[name].$value).toEqual({ value, unit: 'ms' });
    }
    expect(tokens).toEqual(originalTokens);
  });
});
