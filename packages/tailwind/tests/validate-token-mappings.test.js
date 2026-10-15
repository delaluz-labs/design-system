import { describe, expect, it } from 'vitest';
import { validateTokenMappings } from '../scripts/tokens/validate-token-mappings.mjs';

describe('validateTokenMappings', () => {
  it('acepta variables CSS existentes', () => {
    const mappings = {
      '--color-primary': '--delaluz-color-primary',
    };
    const available = new Set(['--delaluz-color-primary']);

    expect(() => validateTokenMappings(mappings, available)).not.toThrow();
  });

  it('rechaza referencias inexistentes', () => {
    const mappings = {
      '--color-surface': '--delaluz-color-inexistente',
    };
    const available = new Set(['--delaluz-color-primary']);

    expect(() => validateTokenMappings(mappings, available)).toThrow(
      'Se encontraron tokens CSS inexistentes',
    );
  });

  it('reporta todas las referencias faltantes', () => {
    const mappings = {
      '--color-surface': '--delaluz-color-surface',
      '--color-content': '--delaluz-color-content',
    };

    expect(() => validateTokenMappings(mappings, new Set())).toThrow(
      /--color-surface requiere --delaluz-color-surface/,
    );
  });
});
