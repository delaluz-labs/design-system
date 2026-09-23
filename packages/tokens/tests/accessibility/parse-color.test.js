import { describe, expect, it } from 'vitest';
import { parseHexColor } from '../../scripts/accessibility/parse-color.mjs';

describe('parseHexColor', () => {
  it('debe convertir negro a RGB', () => {
    expect(parseHexColor('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('debe convertir blanco a RGB', () => {
    expect(parseHexColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('debe convertir un color hexadecimal a RGB', () => {
    expect(parseHexColor('#2563eb')).toEqual({ r: 37, g: 99, b: 235 });
  });

  it('debe aceptar letras HEX mayúsculas', () => {
    expect(parseHexColor('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('debe rechazar formatos no soportados', () => {
    expect(() => parseHexColor('rgb(0, 0, 0)')).toThrow('no utiliza formato HEX');
  });

  it('debe rechazar valores que no sean cadenas', () => {
    expect(() => parseHexColor(null)).toThrow(TypeError);
  });
});
