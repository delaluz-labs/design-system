import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { hashDirectory } from '../../scripts/build/hash-directory.mjs';

let directory;

async function createDirectory() {
  directory = await mkdtemp(join(tmpdir(), 'delaluz-tokens-'));

  return directory;
}

afterEach(async () => {
  if (directory) {
    await rm(directory, { recursive: true, force: true });

    directory = undefined;
  }
});

describe('hashDirectory', () => {
  it('debe producir el mismo hash para el mismo contenido', async () => {
    const path = await createDirectory();

    await writeFile(join(path, 'tokens.json'), '{"value":1}');

    const first = await hashDirectory(path);
    const second = await hashDirectory(path);

    expect(second).toBe(first);
  });

  it('debe cambiar cuando cambia el contenido', async () => {
    const path = await createDirectory();
    const file = join(path, 'tokens.json');

    await writeFile(file, '{"value":1}');

    const first = await hashDirectory(path);

    await writeFile(file, '{"value":2}');

    const second = await hashDirectory(path);

    expect(second).not.toBe(first);
  });

  it('debe considerar archivos anidados', async () => {
    const path = await createDirectory();
    const nested = join(path, 'themes');

    await mkdir(nested);

    await writeFile(join(nested, 'tokens.json'), '{"value":1}');

    const hash = await hashDirectory(path);

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});
