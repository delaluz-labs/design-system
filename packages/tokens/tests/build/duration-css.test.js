import { describe, expect, it } from 'vitest';
import { durationCss } from '../../scripts/build/duration-css.mjs';

describe('duration/css', () => {
  it('selecciona únicamente tokens duration', () => {
    expect(durationCss.filter({ $type: 'duration' })).toBe(true);
    expect(durationCss.filter({ $type: 'color' })).toBe(false);
  });

  it.each([
    [0, 'ms', '0ms'],
    [100, 'ms', '100ms'],
    [1.5, 'ms', '1.5ms'],
    [0, 's', '0s'],
    [2, 's', '2s'],
    [0.5, 's', '0.5s'],
  ])('serializa %s %s como %s', (value, unit, expected) => {
    expect(
      durationCss.transform({
        $value: { value, unit },
        path: ['motion', 'duration', 'fast'],
      }),
    ).toBe(expected);
  });

  it.each(
    [
      null,
      undefined,
      '100ms',
      [],
      {},
      { value: '100', unit: 'ms' },
      { value: NaN, unit: 'ms' },
      { value: Infinity, unit: 's' },
      { value: 100, unit: 'px' },
      { value: 100 },
    ].map((value) => [value]),
  )('rechaza duraciones inválidas: %j', (value) => {
    expect(() =>
      durationCss.transform({
        $value: value,
        path: ['motion', 'duration', 'fast'],
      }),
    ).toThrow('Duración CSS inválida en "motion.duration.fast"');
  });
});
