import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveOrder } from './resolve-order.mjs';
import { validateResolverInput } from './validate-input.mjs';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);
const packageRoot = resolve(currentDirectory, '../../..');
const sourceRoot = resolve(packageRoot, 'src');
const resolverPath = resolve(sourceRoot, 'theme.resolver.json');

async function loadResolver() {
  const content = await readFile(resolverPath, 'utf-8');

  return JSON.parse(content);
}

export async function resolveThemeTokens(input) {
  const resolver = await loadResolver();
  const normalizedInput = validateResolverInput(resolver, input);
  const tokens = await resolveOrder(resolver, normalizedInput, sourceRoot);

  return { input: normalizedInput, tokens };
}
