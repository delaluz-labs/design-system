import { describe, expect, it } from 'vitest';
import { createCssVariableName } from '../../scripts/css/create-css-variable-name.mjs';

describe('createCssVariableName', () => {
  it('debe utilizar el prefijo configurado', () => {
    expect(createCssVariableName('color-text-primary')).toBe('--delaluz-color-text-primary');
  });

  it('debe rechazar una cadena vacía', () => {
    expect(() => createCssVariableName('')).toThrow(
      'El nombre del token debe ser una cadena no vacía.',
    );
  });

  it('debe rechazar valores que no son cadenas', () => {
    expect(() => createCssVariableName(null)).toThrow(TypeError);
  });
});
