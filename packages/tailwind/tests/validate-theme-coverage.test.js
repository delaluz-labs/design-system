import { describe, expect, it } from 'vitest';
import { validateThemeCoverage } from '../scripts/tokens/validate-theme-coverage.mjs';

describe('validateThemeCoverage', () => {
  const sources = {
    base: ':root { --delaluz-radius-lg: 12px; }',

    themes: [
      {
        id: 'light-standard',
        css: ':root { --delaluz-color-surface: white; }',
      },
      {
        id: 'dark-standard',
        css: ':root { --delaluz-color-surface: black; }',
      },
    ],
  };

  it('acepta tokens primitivos definidos en base', () => {
    const mappings = {
      '--radius-lg': {
        source: 'base',
        token: 'radius-lg',
      },
    };

    expect(() => validateThemeCoverage(mappings, sources, 'delaluz')).not.toThrow();
  });

  it('acepta tokens semánticos presentes en todos los temas', () => {
    const mappings = {
      '--color-surface': {
        source: 'theme',
        token: 'color-surface',
      },
    };

    expect(() => validateThemeCoverage(mappings, sources, 'delaluz')).not.toThrow();
  });

  it('detecta tokens faltantes en un tema', () => {
    const incompleteSources = {
      ...sources,

      themes: [
        sources.themes[0],
        {
          id: 'dark-standard',
          css: ':root { --delaluz-color-other: black; }',
        },
      ],
    };

    const mappings = {
      '--color-surface': {
        source: 'theme',
        token: 'color-surface',
      },
    };

    expect(() => validateThemeCoverage(mappings, incompleteSources, 'delaluz')).toThrow(
      /dark-standard/,
    );
  });

  it('rechaza orígenes desconocidos', () => {
    const mappings = {
      '--color-surface': {
        source: 'unknown',
        token: 'color-surface',
      },
    };

    expect(() => validateThemeCoverage(mappings, sources, 'delaluz')).toThrow(
      /Configuración inválida/,
    );
  });

  it('detecta tokens base inexistentes', () => {
    const mappings = {
      '--radius-xl': {
        source: 'base',
        token: 'radius-xl',
      },
    };

    expect(() => validateThemeCoverage(mappings, sources, 'delaluz')).toThrow(/base\.css/);
  });

  it('detecta la ausencia de temas', () => {
    const mappings = {
      '--color-surface': {
        source: 'theme',
        token: 'color-surface',
      },
    };

    expect(() =>
      validateThemeCoverage(mappings, { base: sources.base, themes: [] }, 'delaluz'),
    ).toThrow(/no se encontraron temas/);
  });
});
