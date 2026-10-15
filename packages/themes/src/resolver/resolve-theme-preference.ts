import type { ResolvedTheme } from '../types/resolved-theme';
import type { ThemeEnvironment } from '../types/theme-environment';
import type { ThemePreference } from '../types/theme-preference';

function resolveSystemPreference<T>(preference: T | 'system', environment: T): T {
  return preference === 'system' ? environment : preference;
}

export function resolveThemePreference(
  preference: ThemePreference,
  environment: ThemeEnvironment,
): ResolvedTheme {
  return {
    brand: preference.brand,
    scheme: resolveSystemPreference(preference.scheme, environment.scheme),
    contrast: resolveSystemPreference(preference.contrast, environment.contrast),
    motion: resolveSystemPreference(preference.motion, environment.motion),
  };
}
