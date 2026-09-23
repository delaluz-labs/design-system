export const brands = ['delaluz', 'neutral'];
export const schemes = ['light', 'dark'];
export const contrasts = ['standard', 'high'];
export const motions = ['standard', 'reduced'];
export const themeSources = {
  brand: {
    delaluz: 'src/brand/delaluz.tokens.json',
    neutral: 'src/brand/neutral.tokens.json',
  },

  scheme: {
    light: 'src/scheme/light.tokens.json',
    dark: 'src/scheme/dark.tokens.json',
  },

  contrast: {
    standard: null,
    high: 'src/accessibility/high-contrast.tokens.json',
  },

  motion: {
    standard: null,
    reduced: 'src/accessibility/reduced-motion.tokens.json',
  },
};
