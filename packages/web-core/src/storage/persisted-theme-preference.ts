import type { ThemePreference } from '@delaluz/themes';

export const THEME_PREFERENCE_STORAGE_VERSION = 1;

export interface PersistedThemePreference {
  version: typeof THEME_PREFERENCE_STORAGE_VERSION;
  preference: ThemePreference;
}
