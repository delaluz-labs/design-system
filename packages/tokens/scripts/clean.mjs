import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const distPath = resolve('dist');

await rm(distPath, { recursive: true, force: true });
