import type { ResolvedTheme } from './types/resolved-theme';

export function createThemeId(theme: ResolvedTheme): string {
  return [theme.brand, theme.scheme, theme.contrast, theme.motion].join('-');
}
