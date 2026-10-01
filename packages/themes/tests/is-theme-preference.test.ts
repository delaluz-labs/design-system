import { describe, expect, it } from 'vitest';
import { isThemePreference } from '../src';

describe('isThemePreference', (): void => {
  it('debe aceptar una preferencia válida', (): void => {
    expect(
      isThemePreference({
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      }),
    ).toBe(true);
  });

  it('debe aceptar preferencias explícitas', (): void => {
    expect(
      isThemePreference({
        brand: 'neutral',
        scheme: 'dark',
        contrast: 'high',
        motion: 'reduced',
      }),
    ).toBe(true);
  });

  it.each([null, undefined, 'theme', 123, true, []])(
    'debe rechazar valores que no son objetos: %s',
    (value: string | number | boolean | never[] | null | undefined): void => {
      expect(isThemePreference(value)).toBe(false);
    },
  );

  it('debe rechazar una marca desconocida', (): void => {
    expect(
      isThemePreference({
        brand: 'unknown',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      }),
    ).toBe(false);
  });

  it('debe rechazar un scheme desconocido', (): void => {
    expect(
      isThemePreference({
        brand: 'delaluz',
        scheme: 'sepia',
        contrast: 'system',
        motion: 'system',
      }),
    ).toBe(false);
  });

  it('debe rechazar un contraste desconocido', (): void => {
    expect(
      isThemePreference({
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'maximum',
        motion: 'system',
      }),
    ).toBe(false);
  });

  it('debe rechazar un motion desconocido', (): void => {
    expect(
      isThemePreference({
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'fast',
      }),
    ).toBe(false);
  });
});
