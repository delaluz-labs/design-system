import { mergeTokenTrees } from './merge-token-trees.mjs';
import { loadTokenSource } from './load-token-source.mjs';
import { resolveInternalReference } from './resolve-reference.mjs';

async function mergeSources(sources, sourceRoot) {
  let result = {};

  for (const source of sources) {
    const tokens = await loadTokenSource(sourceRoot, source.$ref);
    result = mergeTokenTrees(result, tokens);
  }

  return result;
}

function getModifierName(reference) {
  const prefix = '#/modifiers/';

  if (!reference.startsWith(prefix)) {
    return null;
  }

  return reference.slice(prefix.length);
}

async function resolveSet(resolver, reference, sourceRoot) {
  const set = resolveInternalReference(resolver, reference);

  return mergeSources(set.sources, sourceRoot);
}

async function resolveModifier(resolver, reference, input, sourceRoot) {
  const modifier = resolveInternalReference(resolver, reference);
  const name = getModifierName(reference);
  const context = input[name];

  return mergeSources(modifier.contexts[context], sourceRoot);
}

async function resolveOrderEntry(resolver, entry, input, sourceRoot) {
  const reference = entry.$ref;

  if (reference.startsWith('#/modifiers/')) {
    return resolveModifier(resolver, reference, input, sourceRoot);
  }

  if (reference.startsWith('#/sets/')) {
    return resolveSet(resolver, reference, sourceRoot);
  }

  throw new Error(`La referencia en resolutionOrder no está soportada: ${reference}.`);
}

export async function resolveOrder(resolver, input, sourceRoot) {
  let result = {};

  for (const entry of resolver.resolutionOrder) {
    const tokens = await resolveOrderEntry(resolver, entry, input, sourceRoot);
    result = mergeTokenTrees(result, tokens);
  }

  return result;
}
