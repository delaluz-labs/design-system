import { describe, expect, it } from 'vitest';
import { createThemeId, resolveThemePreference } from '../src';
import { BRANDS } from '../src/theme-registry';

const schemes = ['light', 'dark'] as const;
const contrasts = ['standard', 'high'] as const;
const motions = ['standard', 'reduced'] as const;

describe('theme permutations', () => {
  it('debe mantener 16 combinaciones válidas', () => {
    const identifiers = new Set<string>();

    for (const { id: brand } of BRANDS) {
      for (const scheme of schemes) {
        for (const contrast of contrasts) {
          for (const motion of motions) {
            const environment = { scheme, contrast, motion };
            const theme = resolveThemePreference(
              { brand, scheme: 'system', contrast: 'system', motion: 'system' },
              environment,
            );

            expect(theme).toEqual({ brand, ...environment });
            identifiers.add(createThemeId(theme));
          }
        }
      }
    }

    expect(identifiers.size).toBe(16);
  });
});
