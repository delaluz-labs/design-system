import {
  isThemePreference,
  type ThemePreference,
  type ThemePreferenceStorage,
} from '@delaluz/themes';
import {
  THEME_PREFERENCE_STORAGE_VERSION,
  type PersistedThemePreference,
} from './persisted-theme-preference';
import { THEME_PREFERENCE_STORAGE_KEY } from './theme-storage-key';

interface CreateLocalStorageThemePreferenceStorageOptions {
  storage: Storage;
  key?: string;
}

export function createLocalStorageThemePreferenceStorage(
  options: CreateLocalStorageThemePreferenceStorageOptions,
): ThemePreferenceStorage {
  const key = options.key ?? THEME_PREFERENCE_STORAGE_KEY;

  return {
    get(): ThemePreference | null {
      const value: string | null = options.storage.getItem(key);

      if (value === null) {
        return null;
      }

      return parsePersistedPreference(value);
    },

    set(preference: ThemePreference): void {
      const value: PersistedThemePreference = {
        version: THEME_PREFERENCE_STORAGE_VERSION,

        preference,
      };

      options.storage.setItem(key, JSON.stringify(value));
    },

    remove(): void {
      options.storage.removeItem(key);
    },
  };
}

function parsePersistedPreference(value: string): ThemePreference | null {
  try {
    const parsed: unknown = JSON.parse(value);

    if (!isPersistedThemePreference(parsed)) {
      return null;
    }

    return parsed.preference;
  } catch {
    return null;
  }
}

function isPersistedThemePreference(value: unknown): value is PersistedThemePreference {
  if (!isRecord(value)) {
    return false;
  }

  return value.version === THEME_PREFERENCE_STORAGE_VERSION && isThemePreference(value.preference);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
