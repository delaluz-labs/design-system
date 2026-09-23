import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function loadTokenSource(sourceRoot, reference) {
  if (typeof reference !== 'string' || reference.startsWith('#')) {
    throw new Error(`La referencia externa no es válida: ${reference}.`);
  }

  const filePath = resolve(sourceRoot, reference);
  const content = await readFile(filePath, 'utf-8');

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`No fue posible interpretar ${reference}.`, { cause: error });
  }
}
