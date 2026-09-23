import type { ThemeBrand } from './theme-brand';
import type { ThemeContrast } from './theme-contrast';
import type { ThemeMotion } from './theme-motion';
import type { ThemeScheme } from './theme-scheme';

export interface ResolvedTheme {
  brand: ThemeBrand;
  scheme: ThemeScheme;
  contrast: ThemeContrast;
  motion: ThemeMotion;
}
