import { brands, contrasts, motions, schemes } from './theme-config.mjs';

export function createThemePermutations() {
  const permutations = [];

  for (const brand of brands) {
    for (const scheme of schemes) {
      for (const contrast of contrasts) {
        for (const motion of motions) {
          permutations.push({ brand, scheme, contrast, motion });
        }
      }
    }
  }

  return permutations;
}
