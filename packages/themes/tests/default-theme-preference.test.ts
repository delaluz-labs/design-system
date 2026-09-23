import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME_PREFERENCE } from '../src';

describe('DEFAULT_THEME_PREFERENCE', (): void => {
  it('debe utilizar la marca De la Luz y las preferencias del sistema', (): void => {
    expect(DEFAULT_THEME_PREFERENCE).toEqual({
      brand: 'delaluz',
      scheme: 'system',
      contrast: 'system',
      motion: 'system',
    });
  });
});
