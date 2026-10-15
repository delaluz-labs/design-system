import { describe, expect, it } from 'vitest';
import {
  extractCssVariables,
  collectCssVariables,
} from '../scripts/tokens/extract-css-variables.mjs';

describe('extractCssVariables', () => {
  it('extrae variables CSS declaradas', () => {
    const css = `
      :root {
        --delaluz-spacing-4: 1rem;
        --delaluz-radius-md: 0.5rem;
      }
    `;

    const result = extractCssVariables(css);

    expect(result.has('--delaluz-spacing-4')).toBe(true);
    expect(result.has('--delaluz-radius-md')).toBe(true);
  });

  it('ignora variables presentes únicamente en comentarios', () => {
    const css = `
      /* --delaluz-color-inexistente: red; */

      :root {
        --delaluz-color-primary: blue;
      }
    `;

    const result = extractCssVariables(css);

    expect(result.has('--delaluz-color-inexistente')).toBe(false);
    expect(result.has('--delaluz-color-primary')).toBe(true);
  });

  it('combina variables sin duplicarlas', () => {
    const result = collectCssVariables([
      ':root { --delaluz-spacing-4: 1rem; }',
      ':root { --delaluz-spacing-4: 1rem; --delaluz-radius-md: 8px; }',
    ]);

    expect(result.size).toBe(2);
  });
});
