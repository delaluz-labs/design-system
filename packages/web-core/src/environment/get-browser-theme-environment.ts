import type { ThemeEnvironment } from '@delaluz/themes';
import type { ThemeMediaQueryLists } from '../media/theme-media-query-lists';

export function getBrowserThemeEnvironment(
  mediaQueryLists: ThemeMediaQueryLists,
): ThemeEnvironment {
  return {
    scheme: mediaQueryLists.scheme.matches ? 'dark' : 'light',
    contrast: mediaQueryLists.contrast.matches ? 'high' : 'standard',
    motion: mediaQueryLists.motion.matches ? 'reduced' : 'standard',
  };
}
