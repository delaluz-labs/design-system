const ATTRIBUTE_NAMES = Object.freeze({
  brand: 'data-theme-brand',
  scheme: 'data-theme-scheme',
  contrast: 'data-theme-contrast',
  motion: 'data-theme-motion',
});

export function createThemeSelector(theme) {
  validateTheme(theme);

  return [
    ':root',
    createAttributeSelector(ATTRIBUTE_NAMES.brand, theme.brand),
    createAttributeSelector(ATTRIBUTE_NAMES.scheme, theme.scheme),
    createAttributeSelector(ATTRIBUTE_NAMES.contrast, theme.contrast),
    createAttributeSelector(ATTRIBUTE_NAMES.motion, theme.motion),
  ].join('');
}

function createAttributeSelector(attribute, value) {
  return `[${attribute}="${value}"]`;
}

function validateTheme(theme) {
  if (typeof theme !== 'object' || theme === null || Array.isArray(theme)) {
    throw new TypeError('El theme debe ser un objeto.');
  }

  const properties = ['brand', 'scheme', 'contrast', 'motion'];

  for (const property of properties) {
    if (typeof theme[property] !== 'string' || theme[property].length === 0) {
      throw new TypeError(`La propiedad "${property}" del theme debe ser una cadena no vacía.`);
    }
  }
}
