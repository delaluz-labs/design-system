import {
  DEFAULT_THEME_PREFERENCE,
  resolveThemePreference,
  type ResolvedTheme,
  type ThemePreference,
  type ThemePreferenceStorage,
  type ThemeEnvironment,
} from '@delaluz/themes';
import { getBrowserThemeEnvironment } from '../environment/get-browser-theme-environment';
import { createThemeMediaQueryLists } from '../media/create-theme-media-query-lists';
import type { MatchMedia } from '../media/match-media';
import type { ThemeMediaQueryLists } from '../media/theme-media-query-lists';
import { applyTheme } from './apply-theme';
import type { ThemeController } from './theme-controller';

interface CreateThemeControllerOptions {
  element: HTMLElement;
  matchMedia: MatchMedia;
  preference: ThemePreference;
  storage?: ThemePreferenceStorage;
}

export function createThemeController(options: CreateThemeControllerOptions): ThemeController {
  const mediaQueryLists: ThemeMediaQueryLists = createThemeMediaQueryLists(options.matchMedia);
  let preference: ThemePreference = options.preference;
  let theme: ResolvedTheme = resolveTheme(preference, mediaQueryLists);
  let disposed = false;

  function refresh(): void {
    theme = resolveTheme(preference, mediaQueryLists);
    applyTheme(options.element, theme);
  }

  function handleEnvironmentChange(): void {
    refresh();
  }

  subscribe(mediaQueryLists, handleEnvironmentChange);

  refresh();

  return {
    getPreference: (): ThemePreference => preference,

    getTheme: (): ResolvedTheme => theme,

    setPreference(nextPreference: ThemePreference): void {
      preference = nextPreference;
      refresh();
      options.storage?.set(nextPreference);
    },

    refresh,

    dispose(): void {
      if (disposed) {
        return;
      }

      unsubscribe(mediaQueryLists, handleEnvironmentChange);
      disposed = true;
    },

    resetPreference(): void {
      preference = DEFAULT_THEME_PREFERENCE;
      options.storage?.remove();
      refresh();
    },
  };
}

function resolveTheme(
  preference: ThemePreference,
  mediaQueryLists: ThemeMediaQueryLists,
): ResolvedTheme {
  const environment: ThemeEnvironment = getBrowserThemeEnvironment(mediaQueryLists);

  return resolveThemePreference(preference, environment);
}

function subscribe(mediaQueryLists: ThemeMediaQueryLists, listener: () => void): void {
  for (const mediaQueryList of Object.values(mediaQueryLists)) {
    mediaQueryList.addEventListener('change', listener);
  }
}

function unsubscribe(mediaQueryLists: ThemeMediaQueryLists, listener: () => void): void {
  for (const mediaQueryList of Object.values(mediaQueryLists)) {
    mediaQueryList.removeEventListener('change', listener);
  }
}
