import type { MatchMedia } from './match-media';
import { THEME_MEDIA_QUERIES } from './theme-media-queries';
import type { ThemeMediaQueryLists } from './theme-media-query-lists';

export function createThemeMediaQueryLists(matchMedia: MatchMedia): ThemeMediaQueryLists {
  return {
    scheme: matchMedia(THEME_MEDIA_QUERIES.darkScheme),
    contrast: matchMedia(THEME_MEDIA_QUERIES.highContrast),
    motion: matchMedia(THEME_MEDIA_QUERIES.reducedMotion),
  };
}
