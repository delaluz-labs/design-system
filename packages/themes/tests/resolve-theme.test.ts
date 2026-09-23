import { describe, expect, it } from 'vitest';
import { type ResolvedTheme, resolveTheme } from '../src';

describe('resolveTheme', (): void => {
  it('debe resolver light desde las preferencias del sistema', (): void => {
    const theme: ResolvedTheme = resolveTheme(
      {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'standard',
        motion: 'standard',
      },
      {
        prefersDarkScheme: false,
        prefersHighContrast: false,
        prefersReducedMotion: false,
      },
    );

    expect(theme.scheme).toBe('light');
  });

  it('debe resolver dark desde las preferencias del sistema', (): void => {
    const theme: ResolvedTheme = resolveTheme(
      {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'standard',
        motion: 'standard',
      },
      {
        prefersDarkScheme: true,
        prefersHighContrast: false,
        prefersReducedMotion: false,
      },
    );

    expect(theme.scheme).toBe('dark');
  });

  it('una preferencia explícita debe tener prioridad sobre el sistema', (): void => {
    const theme: ResolvedTheme = resolveTheme(
      {
        brand: 'delaluz',
        scheme: 'light',
        contrast: 'standard',
        motion: 'standard',
      },
      {
        prefersDarkScheme: true,
        prefersHighContrast: false,
        prefersReducedMotion: false,
      },
    );

    expect(theme.scheme).toBe('light');
  });

  it('debe resolver high contrast y reduced motion', (): void => {
    const theme: ResolvedTheme = resolveTheme(
      {
        brand: 'neutral',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
      {
        prefersDarkScheme: true,
        prefersHighContrast: true,
        prefersReducedMotion: true,
      },
    );

    expect(theme).toEqual({
      brand: 'neutral',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });
  });
});
