import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

/* v8 ignore file */
await rm(resolve('dist'), { recursive: true, force: true });
