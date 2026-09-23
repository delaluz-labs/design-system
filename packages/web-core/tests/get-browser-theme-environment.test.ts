import { describe, expect, it } from 'vitest';
import { getBrowserThemeEnvironment } from '../src';
import type { ThemeEnvironment } from '@delaluz/themes';

function createMediaQueryList(matches: boolean): MediaQueryList {
  return { matches } as MediaQueryList;
}

describe('getBrowserThemeEnvironment', (): void => {
  it('debe resolver las preferencias estándar', () => {
    const environment: ThemeEnvironment = getBrowserThemeEnvironment({
      scheme: createMediaQueryList(false),
      contrast: createMediaQueryList(false),
      motion: createMediaQueryList(false),
    });

    expect(environment).toEqual({
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    });
  });

  it('debe resolver las preferencias alternativas', (): void => {
    const environment: ThemeEnvironment = getBrowserThemeEnvironment({
      scheme: createMediaQueryList(true),
      contrast: createMediaQueryList(true),
      motion: createMediaQueryList(true),
    });

    expect(environment).toEqual({
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    });
  });
});
