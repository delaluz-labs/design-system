import { describe, expect, it } from 'vitest';
import { validateReducedMotion } from '../../scripts/theme/validation/reduced-motion.mjs';

describe('reduced motion', () => {
  it('debe neutralizar las duraciones configuradas', async () => {
    const theme = {
      brand: 'delaluz',
      scheme: 'light',
      contrast: 'standard',
    };

    await expect(validateReducedMotion({ ...theme })).resolves.toBeUndefined();
  });
});
