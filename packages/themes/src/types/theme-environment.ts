import type { ThemeContrast } from './theme-contrast';
import type { ThemeMotion } from './theme-motion';
import type { ThemeScheme } from './theme-scheme';

export interface ThemeEnvironment {
  scheme: ThemeScheme;
  contrast: ThemeContrast;
  motion: ThemeMotion;
}
