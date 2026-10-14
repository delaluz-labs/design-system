import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const css = await readFile(new URL('./generated/output.css', import.meta.url), 'utf-8');

describe('Integración con Tailwind CSS 4', () => {
  it('genera la utilidad bg-surface', () => {
    expect(css).toContain('.bg-surface');
    expect(css).toContain('var(--delaluz-test-surface)');
  });

  it('genera la utilidad text-content', () => {
    expect(css).toContain('.text-content');
    expect(css).toContain('var(--delaluz-test-content)');
  });

  it('genera la utilidad border-outline', () => {
    expect(css).toContain('.border-outline');
    expect(css).toContain('var(--delaluz-test-outline)');
  });

  it('genera la variante de esquema oscuro', () => {
    expect(css).toContain('theme-dark');
    expect(css).toContain('data-theme-scheme');
  });

  it('genera la variante de contraste alto', () => {
    expect(css).toContain('theme-high-contrast');
    expect(css).toContain('data-theme-contrast');
  });

  it('genera la variante de movimiento reducido', () => {
    expect(css).toContain('theme-reduced-motion');
    expect(css).toContain('data-theme-motion');
  });

  it('conserva las variables temáticas', () => {
    expect(css).toContain('--delaluz-test-surface: #ffffff');
    expect(css).toContain("data-theme-scheme='dark'");
  });
});
