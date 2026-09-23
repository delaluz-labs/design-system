import type { ResolvedTheme, ThemePreference } from '@delaluz/themes';

export interface ThemeController {
  getPreference(): ThemePreference;

  getTheme(): ResolvedTheme;

  setPreference(preference: ThemePreference): void;

  refresh(): void;

  dispose(): void;
}
