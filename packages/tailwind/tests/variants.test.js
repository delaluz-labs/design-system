import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const variants = await readFile(new URL('../src/variants.css', import.meta.url), 'utf-8');

describe('Tailwind theme variants', () => {
  it('registra la variante dark', () => {
    expect(variants).toContain('@custom-variant theme-dark');
    expect(variants).toContain("data-theme-scheme='dark'");
  });

  it('registra la variante high contrast', () => {
    expect(variants).toContain('@custom-variant theme-high-contrast');
  });

  it('registra la variante reduced motion', () => {
    expect(variants).toContain('@custom-variant theme-reduced-motion');
  });
});
