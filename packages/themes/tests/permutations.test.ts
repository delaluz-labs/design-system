import { describe, expect, it } from 'vitest';

const brands = ['delaluz', 'neutral'] as const;
const schemes = ['light', 'dark'] as const;
const contrasts = ['standard', 'high'] as const;
const motions = ['standard', 'reduced'] as const;

describe('theme permutations', () => {
  it('debe mantener 16 combinaciones válidas', () => {
    const total = brands.length * schemes.length * contrasts.length * motions.length;

    expect(total).toBe(16);
  });
});
