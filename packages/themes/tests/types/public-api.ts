// Compile-only contracts: executed by typecheck, not by Vitest.
import {
  DEFAULT_THEME_PREFERENCE,
  createThemeId,
  resolveThemePreference,
  type ResolvedTheme,
  type ThemeBrand,
  type ThemeContrast,
  type ThemeContrastPreference,
  type ThemeEnvironment,
  type ThemeMotion,
  type ThemeMotionPreference,
  type ThemePreference,
  type ThemeScheme,
  type ThemeSchemePreference,
} from '../../src';

['delaluz', 'neutral'] satisfies ThemeBrand[];
['light', 'dark'] satisfies ThemeScheme[];
['standard', 'high'] satisfies ThemeContrast[];
['standard', 'reduced'] satisfies ThemeMotion[];
['light', 'dark', 'system'] satisfies ThemeSchemePreference[];
['standard', 'high', 'system'] satisfies ThemeContrastPreference[];
['standard', 'reduced', 'system'] satisfies ThemeMotionPreference[];

const preference = {
  brand: 'delaluz',
  scheme: 'system',
  contrast: 'system',
  motion: 'system',
} satisfies ThemePreference;
const environment = {
  scheme: 'dark',
  contrast: 'high',
  motion: 'reduced',
} satisfies ThemeEnvironment;

DEFAULT_THEME_PREFERENCE satisfies Readonly<ThemePreference>;
resolveThemePreference(preference, environment) satisfies ResolvedTheme;
createThemeId(resolveThemePreference(preference, environment)) satisfies string;

// @ts-expect-error Unsupported brands must not be accepted.
'unknown' satisfies ThemeBrand;
// @ts-expect-error Preferences must use a supported brand.
({ ...preference, brand: 'unknown' }) satisfies ThemePreference;
// @ts-expect-error An environment must contain a resolved scheme.
({ ...environment, scheme: 'system' }) satisfies ThemeEnvironment;
// @ts-expect-error An environment must contain resolved contrast.
({ ...environment, contrast: 'system' }) satisfies ThemeEnvironment;
// @ts-expect-error An environment must contain resolved motion.
({ ...environment, motion: 'system' }) satisfies ThemeEnvironment;

const resolved = { brand: 'neutral', ...environment } satisfies ResolvedTheme;
// @ts-expect-error A resolved theme cannot defer its scheme to the system.
({ ...resolved, scheme: 'system' }) satisfies ResolvedTheme;
// @ts-expect-error A resolved theme cannot defer its contrast to the system.
({ ...resolved, contrast: 'system' }) satisfies ResolvedTheme;
// @ts-expect-error A resolved theme cannot defer its motion to the system.
({ ...resolved, motion: 'system' }) satisfies ResolvedTheme;
// @ts-expect-error The resolver requires resolved environment dimensions.
resolveThemePreference(preference, { ...environment, scheme: 'system' });
// @ts-expect-error Identifiers require a resolved theme, not a preference.
createThemeId(preference);
