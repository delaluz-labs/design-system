import { describe, expect, it } from 'vitest';
import { getBrowserThemeEnvironment, THEME_MEDIA_QUERIES } from '../src';
import type { ThemeEnvironment } from '@delaluz/themes';

function createMatchMedia(
  matchesByQuery: Readonly<Record<string, boolean>>,
): (query: string) => MediaQueryList {
  return (query: string): MediaQueryList =>
    ({
      matches: matchesByQuery[query] ?? false,
      media: query,
    }) as MediaQueryList;
}

describe('getBrowserThemeEnvironment', (): void => {
  it('debe obtener las preferencias predeterminadas del navegador', (): void => {
    const environment: ThemeEnvironment = getBrowserThemeEnvironment(createMatchMedia({}));

    expect(environment).toEqual({
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    });
  });

  it('debe detectar dark, high contrast y reduced motion', (): void => {
    const environment: ThemeEnvironment = getBrowserThemeEnvironment(
      createMatchMedia({
        [THEME_MEDIA_QUERIES.darkScheme]: true,
        [THEME_MEDIA_QUERIES.highContrast]: true,
        [THEME_MEDIA_QUERIES.reducedMotion]: true,
      }),
    );

    expect(environment).toEqual({
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });
  });

  it('debe resolver cada preferencia de forma independiente', (): void => {
    const environment: ThemeEnvironment = getBrowserThemeEnvironment(
      createMatchMedia({
        [THEME_MEDIA_QUERIES.darkScheme]: true,
        [THEME_MEDIA_QUERIES.reducedMotion]: true,
      }),
    );

    expect(environment).toEqual({
      scheme: 'dark',
      contrast: 'standard',
      motion: 'reduced',
    });
  });
});
