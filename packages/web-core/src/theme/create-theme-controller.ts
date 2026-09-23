import { resolveThemePreference, type ResolvedTheme, type ThemePreference } from '@delaluz/themes';

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
}

export function createThemeController(options: CreateThemeControllerOptions): ThemeController {
  const mediaQueryLists = createThemeMediaQueryLists(options.matchMedia);

  let preference = options.preference;

  let theme = resolveTheme(preference, mediaQueryLists);

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
    getPreference: () => preference,

    getTheme: () => theme,

    setPreference(nextPreference) {
      preference = nextPreference;

      refresh();
    },

    refresh,

    dispose() {
      if (disposed) {
        return;
      }

      unsubscribe(mediaQueryLists, handleEnvironmentChange);
      disposed = true;
    },
  };
}

function resolveTheme(
  preference: ThemePreference,
  mediaQueryLists: ThemeMediaQueryLists,
): ResolvedTheme {
  const environment = getBrowserThemeEnvironment(mediaQueryLists);

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
