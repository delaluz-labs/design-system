import type { ThemeBrand } from './theme-brand';
import type { ThemeContrastPreference } from './theme-contrast';
import type { ThemeMotionPreference } from './theme-motion';
import type { ThemeSchemePreference } from './theme-scheme';

export interface ThemePreference {
  brand: ThemeBrand;
  scheme: ThemeSchemePreference;
  contrast: ThemeContrastPreference;
  motion: ThemeMotionPreference;
}
