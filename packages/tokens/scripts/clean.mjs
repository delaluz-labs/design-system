import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

/* v8 ignore file */
const distPath = resolve('dist');
await rm(distPath, { recursive: true, force: true });
