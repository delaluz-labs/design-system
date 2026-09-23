import type { ResolvedTheme, ThemeEnvironment, ThemePreference } from './theme.types';

export function resolveTheme(preference: ThemePreference, env: ThemeEnvironment): ResolvedTheme {
  return {
    brand: preference.brand,
    scheme:
      preference.scheme === 'system'
        ? env.prefersDarkScheme
          ? 'dark'
          : 'light'
        : preference.scheme,
    contrast:
      preference.contrast === 'system'
        ? env.prefersHighContrast
          ? 'high'
          : 'standard'
        : preference.contrast,
    motion:
      preference.motion === 'system'
        ? env.prefersReducedMotion
          ? 'reduced'
          : 'standard'
        : preference.motion,
  };
}
