import type { ThemeEnvironment } from '@delaluz/themes';
import type { MatchMedia } from '../media/match-media';
import { THEME_MEDIA_QUERIES } from '../media/theme-media-queries';

export function getBrowserThemeEnvironment(matchMedia: MatchMedia): ThemeEnvironment {
  return {
    scheme: matchMedia(THEME_MEDIA_QUERIES.darkScheme).matches ? 'dark' : 'light',
    contrast: matchMedia(THEME_MEDIA_QUERIES.highContrast).matches ? 'high' : 'standard',
    motion: matchMedia(THEME_MEDIA_QUERIES.reducedMotion).matches ? 'reduced' : 'standard',
  };
}
