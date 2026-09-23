import { describe, expect, it, type Mock, vi } from 'vitest';
import { createThemeMediaQueryLists } from '../src/media/create-theme-media-query-lists';
import { THEME_MEDIA_QUERIES } from '../src';
import type { ThemeMediaQueryLists } from '../src/media/theme-media-query-lists';

describe('createThemeMediaQueryLists', (): void => {
  it('debe crear las tres consultas del theme', (): void => {
    const matchMedia: Mock<(query: string) => MediaQueryList> = vi.fn(
      (query: string): MediaQueryList => ({ media: query, matches: false }) as MediaQueryList,
    );
    const result: ThemeMediaQueryLists = createThemeMediaQueryLists(matchMedia);

    expect(matchMedia).toHaveBeenCalledTimes(3);
    expect(result.scheme.media).toBe(THEME_MEDIA_QUERIES.darkScheme);
    expect(result.contrast.media).toBe(THEME_MEDIA_QUERIES.highContrast);
    expect(result.motion.media).toBe(THEME_MEDIA_QUERIES.reducedMotion);
  });
});
