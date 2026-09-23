import { describe, expect, it } from 'vitest';
import { compareContrastResults } from '../../scripts/theme/validation/compare-contrast-results.mjs';

describe('compareContrastResults', () => {
  it('debe aceptar un contraste superior', () => {
    expect(() =>
      compareContrastResults('Texto principal', { ratio: 4.5 }, { ratio: 7 }),
    ).not.toThrow();
  });

  it('debe fallar si falta el resultado high contrast', () => {
    expect(() => compareContrastResults('Texto principal', { ratio: 4.5 }, undefined)).toThrow(
      'No se encontró el resultado',
    );
  });

  it('debe fallar si high contrast empeora', () => {
    expect(() => compareContrastResults('Texto principal', { ratio: 7 }, { ratio: 4.5 })).toThrow(
      'High contrast empeora',
    );
  });
});
