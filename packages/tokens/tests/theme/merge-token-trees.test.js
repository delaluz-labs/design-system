import { describe, expect, it } from 'vitest';
import { mergeTokenTrees } from '../../scripts/theme/resolver/merge-token-trees.mjs';

describe('mergeTokenTrees', () => {
  it('debe conservar propiedades existentes', () => {
    const result = mergeTokenTrees(
      {
        color: {
          background: {
            $value: '#ffffff',
          },
        },
      },
      {
        spacing: {
          md: {
            $value: '16px',
          },
        },
      },
    );

    expect(result.color).toBeDefined();
    expect(result.spacing).toBeDefined();
  });

  it('el último valor debe tener prioridad', () => {
    const result = mergeTokenTrees(
      {
        color: {
          background: {
            $type: 'color',
            $value: '#ffffff',
          },
        },
      },
      {
        color: {
          background: {
            $type: 'color',
            $value: '#121212',
          },
        },
      },
    );

    expect(result.color.background.$value).toBe('#121212');
  });
});
