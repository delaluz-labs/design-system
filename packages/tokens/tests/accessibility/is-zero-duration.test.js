import { describe, expect, it } from 'vitest';
import { isZeroDuration } from '../../scripts/accessibility/is-zero-duration.mjs';

describe('isZeroDuration', () => {
  it.each([
    0,
    '0ms',
    '0s',
    {
      value: 0,
      unit: 'ms',
    },
    {
      value: 0,
      unit: 's',
    },
  ])('debe aceptar una duración neutralizada: %o', (value) => {
    expect(isZeroDuration(value)).toBe(true);
  });

  it.each([
    '100ms',
    '1s',
    {
      value: 100,
      unit: 'ms',
    },
    {
      value: 1,
      unit: 's',
    },
  ])('debe rechazar una duración activa: %o', (value) => {
    expect(isZeroDuration(value)).toBe(false);
  });
});
