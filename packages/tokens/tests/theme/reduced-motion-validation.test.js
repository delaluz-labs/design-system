import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateReducedMotion } from '../../scripts/theme/validation/reduced-motion.mjs';

const mocks = vi.hoisted(() => ({
  getTransformedTheme: vi.fn(),
}));

vi.mock('../../scripts/theme/get-transformed-theme.mjs', () => ({
  getTransformedTheme: mocks.getTransformedTheme,
}));

const theme = {
  brand: 'delaluz',
  scheme: 'light',
  contrast: 'standard',
  motion: 'standard',
};

function createTokens() {
  return {
    motion: {
      duration: {
        fast: { value: '0ms' },
        normal: { value: 0 },
        slow: { value: { value: 0, unit: 's' } },
      },
    },
  };
}

function provideTokens(tokens) {
  mocks.getTransformedTheme.mockResolvedValue({
    dictionary: { tokens },
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  provideTokens(createTokens());
});

describe('reduced motion validation', () => {
  it('solicita reduced motion sin modificar el theme recibido', async () => {
    const input = { ...theme };

    await expect(validateReducedMotion(input)).resolves.toBeUndefined();

    expect(mocks.getTransformedTheme).toHaveBeenCalledExactlyOnceWith({
      ...theme,
      motion: 'reduced',
    });
    expect(input).toEqual(theme);
  });

  it.each(['fast', 'normal', 'slow'])('rechaza una duración %s que no sea cero', async (name) => {
    const tokens = createTokens();
    tokens.motion.duration[name] = { value: '100ms' };
    provideTokens(tokens);

    await expect(validateReducedMotion(theme)).rejects.toThrow(
      `Reduced motion no neutraliza "motion.duration.${name}". Valor actual: 100ms.`,
    );
  });

  it.each([
    ['numérico', 100, '100'],
    ['objeto DTCG', { value: 100, unit: 'ms' }, '{"value":100,"unit":"ms"}'],
    ['nulo', null, 'null'],
  ])('incluye el valor %s en el mensaje de error', async (_name, value, formattedValue) => {
    const tokens = createTokens();
    tokens.motion.duration.fast = { value };
    provideTokens(tokens);

    await expect(validateReducedMotion(theme)).rejects.toThrow(
      `Reduced motion no neutraliza "motion.duration.fast". Valor actual: ${formattedValue}.`,
    );
  });

  it('rechaza un token de duración ausente', async () => {
    const tokens = createTokens();
    delete tokens.motion.duration.normal;
    provideTokens(tokens);

    await expect(validateReducedMotion(theme)).rejects.toThrow(
      'No se encontró el token "motion.duration.normal".',
    );
  });

  it('rechaza un token sin valor', async () => {
    const tokens = createTokens();
    tokens.motion.duration.fast = {};
    provideTokens(tokens);

    await expect(validateReducedMotion(theme)).rejects.toThrow(
      'El token "motion.duration.fast" no contiene un valor.',
    );
  });

  it('propaga errores de transformación del theme', async () => {
    const error = new Error('No fue posible transformar el theme');
    mocks.getTransformedTheme.mockRejectedValueOnce(error);

    await expect(validateReducedMotion(theme)).rejects.toBe(error);
  });
});
