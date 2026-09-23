import { mkdir, writeFile } from 'node:fs/promises';
import { createThemePermutations } from '../theme/create-permutations.mjs';
import { createThemeId } from '../theme/create-theme-id.mjs';

export async function buildThemeManifest() {
  const themes = createThemePermutations().map((theme) => ({ id: createThemeId(theme), ...theme }));
  const manifest = {
    version: 1,
    defaults: {
      brand: 'delaluz',
      scheme: 'light',
      contrast: 'standard',
      motion: 'standard',
    },
    themes,
  };

  await mkdir('dist/json', { recursive: true });
  await writeFile(
    'dist/json/theme-manifest.json',
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf-8',
  );
}
