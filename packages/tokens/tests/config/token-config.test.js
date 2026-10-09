import { describe, expect, it } from 'vitest';
import { TOKEN_CONFIG } from '../../config/token-config.mjs';

describe('TOKEN_CONFIG', () => {
  it('debe definir un prefijo CSS', () => {
    expect(TOKEN_CONFIG.cssVariablePrefix).toBe('delaluz');
  });

  it('debe utilizar un prefijo compatible con CSS', () => {
    expect(TOKEN_CONFIG.cssVariablePrefix).toMatch(/^[a-z][a-z0-9-]*$/);
  });
});
