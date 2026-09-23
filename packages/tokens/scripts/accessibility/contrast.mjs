const SRGB_THRESHOLD = 0.04045;
const SRGB_DIVISOR = 12.92;
const SRGB_OFFSET = 0.055;
const SRGB_SCALE = 1.055;
const SRGB_EXPONENT = 2.4;

const RED_LUMINANCE_WEIGHT = 0.2126;
const GREEN_LUMINANCE_WEIGHT = 0.7152;
const BLUE_LUMINANCE_WEIGHT = 0.0722;

function validateChannel(channel) {
  if (typeof channel !== 'number' || !Number.isFinite(channel) || channel < 0 || channel > 255) {
    throw new RangeError(
      `El canal RGB debe ser un número entre 0 y 255. Valor recibido: ${channel}.`,
    );
  }
}

function normalizeChannel(channel) {
  validateChannel(channel);

  const normalized = channel / 255;

  if (normalized <= SRGB_THRESHOLD) {
    return normalized / SRGB_DIVISOR;
  }

  return Math.pow((normalized + SRGB_OFFSET) / SRGB_SCALE, SRGB_EXPONENT);
}

export function relativeLuminance({ r, g, b }) {
  const red = normalizeChannel(r);
  const green = normalizeChannel(g);
  const blue = normalizeChannel(b);

  return RED_LUMINANCE_WEIGHT * red + GREEN_LUMINANCE_WEIGHT * green + BLUE_LUMINANCE_WEIGHT * blue;
}

export function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}
