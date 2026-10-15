import { describe, expect, it } from 'vitest';
import { generateTailwindTheme } from '../scripts/generate-theme.mjs';

describe('generateTailwindTheme', () => {
  it('genera variables mediante @theme inline', () => {
    const result = generateTailwindTheme({
      '--color-surface': '--delaluz-color-background-page',
    });

    expect(result).toContain('@theme inline');
    expect(result).toContain('--color-surface: var(--delaluz-color-background-page);');
  });

  it('rechaza nombres de variables CSS inválidos', () => {
    expect(() =>
      generateTailwindTheme({
        '--color-surface': 'color-background-page',
      }),
    ).toThrow(TypeError);
  });

  it('rechaza namespaces Tailwind desconocidos', () => {
    expect(() =>
      generateTailwindTheme({
        '--custom-unknown': '--delaluz-color-primary',
      }),
    ).toThrow(TypeError);
  });
});
