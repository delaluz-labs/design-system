import { buildBase } from './build/build-base.mjs';
import { buildThemes } from './build/build-themes.mjs';
import { buildThemeManifest } from './build/build-manifest.mjs';
import { buildCssFoundations } from './build/build-css-foundations.mjs';
import { buildCssEntrypoint } from './build/build-css-entrypoint.mjs';

await buildBase();
await buildThemes();
await buildThemeManifest();
await buildCssFoundations();
await buildCssEntrypoint();
