import { describe, expect, it } from 'vitest';
import { createLocalStorageThemePreferenceStorage, THEME_PREFERENCE_STORAGE_KEY } from '../src';
import { type ThemePreferenceStorage } from '@delaluz/themes';

function createStorage(): Storage {
  const values = new Map<string, string>();

  return {
    get length(): number {
      return values.size;
    },

    clear(): void {
      values.clear();
    },

    getItem(key: string): string | null {
      return values.get(key) ?? null;
    },

    key(index: number): string | null {
      return [...values.keys()][index] ?? null;
    },

    removeItem(key: string): void {
      values.delete(key);
    },

    setItem(key: string, value: string): void {
      values.set(key, value);
    },
  };
}

describe('createLocalStorageThemePreferenceStorage', (): void => {
  it('debe devolver null cuando no existe una preferencia', (): void => {
    const storage: Storage = createStorage();
    const adapter: ThemePreferenceStorage = createLocalStorageThemePreferenceStorage({
      storage,
    });

    expect(adapter.get()).toBeNull();
  });

  it('debe persistir y recuperar una preferencia', (): void => {
    const storage: Storage = createStorage();
    const adapter: ThemePreferenceStorage = createLocalStorageThemePreferenceStorage({
      storage,
    });
    const preference = {
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'high',
      motion: 'reduced',
    } as const;

    adapter.set(preference);

    expect(adapter.get()).toEqual(preference);
  });

  it('debe persistir el envelope versionado', (): void => {
    const storage: Storage = createStorage();
    const adapter: ThemePreferenceStorage = createLocalStorageThemePreferenceStorage({
      storage,
    });

    adapter.set({
      brand: 'delaluz',
      scheme: 'system',
      contrast: 'system',
      motion: 'system',
    });

    const value: string | null = storage.getItem(THEME_PREFERENCE_STORAGE_KEY);

    expect(JSON.parse(value as string)).toEqual({
      version: 1,
      preference: {
        brand: 'delaluz',
        scheme: 'system',
        contrast: 'system',
        motion: 'system',
      },
    });
  });

  it('debe eliminar la preferencia persistida', (): void => {
    const storage: Storage = createStorage();
    const adapter: ThemePreferenceStorage = createLocalStorageThemePreferenceStorage({
      storage,
    });

    adapter.set({
      brand: 'delaluz',
      scheme: 'dark',
      contrast: 'standard',
      motion: 'standard',
    });

    adapter.remove();

    expect(adapter.get()).toBeNull();
  });

  it('debe devolver null para JSON inválido', (): void => {
    const storage: Storage = createStorage();

    storage.setItem(THEME_PREFERENCE_STORAGE_KEY, '{invalid-json');

    const adapter: ThemePreferenceStorage = createLocalStorageThemePreferenceStorage({
      storage,
    });

    expect(adapter.get()).toBeNull();
  });

  it('debe devolver null para una versión desconocida', (): void => {
    const storage: Storage = createStorage();

    storage.setItem(
      THEME_PREFERENCE_STORAGE_KEY,
      JSON.stringify({
        version: 999,
        preference: {
          brand: 'delaluz',
          scheme: 'dark',
          contrast: 'standard',
          motion: 'standard',
        },
      }),
    );

    const adapter: ThemePreferenceStorage = createLocalStorageThemePreferenceStorage({
      storage,
    });

    expect(adapter.get()).toBeNull();
  });

  it('debe devolver null para una preferencia inválida', (): void => {
    const storage: Storage = createStorage();

    storage.setItem(
      THEME_PREFERENCE_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        preference: {
          brand: 'unknown',
          scheme: 'purple',
          contrast: 'maximum',
          motion: 'turbo',
        },
      }),
    );

    const adapter: ThemePreferenceStorage = createLocalStorageThemePreferenceStorage({
      storage,
    });

    expect(adapter.get()).toBeNull();
  });

  it('debe permitir utilizar una key personalizada', (): void => {
    const storage: Storage = createStorage();
    const adapter: ThemePreferenceStorage = createLocalStorageThemePreferenceStorage({
      storage,
      key: 'app.theme',
    });

    adapter.set({
      brand: 'neutral',
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    });

    expect(storage.getItem('app.theme')).not.toBeNull();
    expect(storage.getItem(THEME_PREFERENCE_STORAGE_KEY)).toBeNull();
  });
});
