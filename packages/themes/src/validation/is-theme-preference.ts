import type { ThemePreference } from '../types/theme-preference';

const THEME_BRANDS = ['delaluz', 'neutral'] as const;
const THEME_SCHEMES = ['light', 'dark', 'system'] as const;
const THEME_CONTRASTS = ['standard', 'high', 'system'] as const;
const THEME_MOTIONS = ['standard', 'reduced', 'system'] as const;

export function isThemePreference(value: unknown): value is ThemePreference {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isIncluded(THEME_BRANDS, value.brand) &&
    isIncluded(THEME_SCHEMES, value.scheme) &&
    isIncluded(THEME_CONTRASTS, value.contrast) &&
    isIncluded(THEME_MOTIONS, value.motion)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIncluded<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && values.includes(value as T);
}
