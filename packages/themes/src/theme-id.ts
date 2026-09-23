import type { ResolvedTheme } from './theme.types';

export function createThemeId(theme: ResolvedTheme): string {
  return [theme.brand, theme.scheme, theme.contrast, theme.motion].join('-');
}
