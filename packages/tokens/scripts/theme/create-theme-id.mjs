export function createThemeId(theme) {
  return [theme.brand, theme.scheme, theme.contrast, theme.motion].join('-');
}
