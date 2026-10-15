import { describe, expect, it } from 'vitest';
import { type ResolvedTheme, resolveThemePreference } from '../src';

describe('resolveThemePreference', (): void => {
  it('no modifica las preferencias ni el entorno recibidos', () => {
    const preference = Object.freeze({
      brand: 'delaluz',
      scheme: 'system',
      contrast: 'standard',
      motion: 'system',
    } as const);
    const environment = Object.freeze({
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    } as const);
    const originalPreference = { ...preference };
    const originalEnvironment = { ...environment };

    const result = resolveThemePreference(preference, environment);

    expect(result).toEqual({
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'standard',
      motion: 'reduced',
    });
    expect(preference).toEqual(originalPreference);
    expect(environment).toEqual(originalEnvironment);
    expect(result).not.toBe(preference);
    expect(result).not.toBe(environment);
  });

  it('debe conservar las preferencias explícitas', (): void => {
    const result: ResolvedTheme = resolveThemePreference(
      {
        brand: 'neutral',
        scheme: 'light',
        contrast: 'standard',
        motion: 'standard',
      },
      {
        scheme: 'dark',
        contrast: 'high',
        motion: 'reduced',
      },
    );

    expect(result).toEqual({
      brand: 'neutral',
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    });
  });

  it.each([
    { scheme: 'light', contrast: 'standard', motion: 'standard' },
    { scheme: 'dark', contrast: 'high', motion: 'reduced' },
  ] as const)('debe resolver las preferencias del sistema: %j', (environment): void => {
    const result: ResolvedTheme = resolveThemePreference(
      {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
      environment,
    );

    expect(result).toEqual({
      brand: 'delaluz',
      ...environment,
    });
  });

  it('debe resolver preferencias explícitas y del sistema de forma independiente', (): void => {
    const result: ResolvedTheme = resolveThemePreference(
      {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'standard',
        motion: 'system',
      },
      {
        scheme: 'dark',
        contrast: 'high',
        motion: 'reduced',
      },
    );

    expect(result).toEqual({
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'standard',
      motion: 'reduced',
    });
  });
});
