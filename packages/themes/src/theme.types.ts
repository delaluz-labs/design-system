export type ThemeBrand = 'delaluz' | 'neutral';

export type ThemeScheme = 'light' | 'dark';

export type ThemeSchemePreference = ThemeScheme | 'system';

export type ThemeContrast = 'standard' | 'high';

export type ThemeContrastPreference = ThemeContrast | 'system';

export type ThemeMotion = 'standard' | 'reduced';

export type ThemeMotionPreference = ThemeMotion | 'system';

export interface ThemePreference {
  readonly brand: ThemeBrand;
  readonly scheme: ThemeSchemePreference;
  readonly contrast: ThemeContrastPreference;
  readonly motion: ThemeMotionPreference;
}

export interface ThemeEnvironment {
  readonly prefersDarkScheme: boolean;
  readonly prefersHighContrast: boolean;
  readonly prefersReducedMotion: boolean;
}

export interface ResolvedTheme {
  readonly brand: ThemeBrand;
  readonly scheme: ThemeScheme;
  readonly contrast: ThemeContrast;
  readonly motion: ThemeMotion;
}
