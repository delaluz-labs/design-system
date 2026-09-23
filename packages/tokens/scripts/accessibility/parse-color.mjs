const HEX_COLOR_PATTERN = /^#([0-9a-f]{6})$/i;

export function parseHexColor(value) {
  if (typeof value !== 'string') {
    throw new TypeError('El color debe ser una cadena.');
  }

  const match = HEX_COLOR_PATTERN.exec(value);

  if (!match) {
    throw new Error(`El color "${value}" no utiliza formato HEX de 6 dígitos.`);
  }

  const hex = match[1];

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}
