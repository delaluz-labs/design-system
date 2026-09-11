import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

describe('Design Tokens', () => {
  it('debe contener tokens primitivos de color', async () => {
    const file = resolve(__dirname, '..', './src/primitive/color.tokens.json');
    const fileContent = await readFile(file, 'utf-8');
    const content = JSON.parse(fileContent);

    expect(content.color).toBeDefined();
    expect(content.color.blue['500']).toBeDefined();
  });

  it('todo token primitivo de color debe utilizar $type color', async () => {
    const file = resolve(__dirname, '..', './src/primitive/color.tokens.json');
    const fileContent = await readFile(file, 'utf-8');
    const content = JSON.parse(fileContent);
    const token = content.color.blue['500'];

    expect(token.$type).toBe('color');
    expect(token.$value.colorSpace).toBe('srgb');
    expect(token.$value.components).toHaveLength(3);
  });

  it('los colores deben declarar fallback hexadecimal', async () => {
    const file = resolve(__dirname, '..', './src/primitive/color.tokens.json');
    const fileContent = await readFile(file, 'utf-8');
    const content = JSON.parse(fileContent);
    const value = content.color.blue['500'].$value;

    expect(value.hex).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('los tokens semánticos deben referenciar primitives', async () => {
    const file = resolve(__dirname, '..', './src/semantic/color.tokens.json');
    const fileContent = await readFile(file, 'utf-8');
    const content = JSON.parse(fileContent);

    expect(content.semantic.color.action.primary.$value).toBe('{color.blue.500}');
  });
});
