import { describe, expect, it } from 'vitest';
import { validateHighContrast } from '../../scripts/theme/validation/high-contrast.mjs';

describe('high contrast', () => {
  it('no debe empeorar el contraste del theme De la Luz light', async () => {
    const theme = {
      brand: 'delaluz',
      scheme: 'light',
      motion: 'standard',
    };

    await expect(validateHighContrast(theme)).resolves.toBeUndefined();
  });

  it('no debe empeorar el contraste del theme De la Luz dark', async () => {
    const theme = {
      brand: 'delaluz',
      scheme: 'dark',
      motion: 'standard',
    };

    await expect(validateHighContrast(theme)).resolves.toBeUndefined();
  });
});
