import { themeSources } from './theme-config.mjs';

export function getThemeSources(theme) {
  return [
    themeSources.brand[theme.brand],
    themeSources.scheme[theme.scheme],
    themeSources.contrast[theme.contrast],
    themeSources.motion[theme.motion],
  ].filter(Boolean);
}
