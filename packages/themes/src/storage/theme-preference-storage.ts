import type { ThemePreference } from '../types/theme-preference';

export interface ThemePreferenceStorage {
  get(): ThemePreference | null;

  set(preference: ThemePreference): void;

  remove(): void;
}
