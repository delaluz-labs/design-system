import { buildBase } from './build/build-base.mjs';
import { buildThemes } from './build/build-themes.mjs';
import { buildThemeManifest } from './build/build-manifest.mjs';

await buildBase();
await buildThemes();
await buildThemeManifest();
