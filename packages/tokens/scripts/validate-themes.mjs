import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createThemePermutations } from './theme/create-permutations.mjs';
import { extractExternalReferences } from './theme/validation/references.mjs';
import { validateThemeResolutions } from './theme/validation/resolutions.mjs';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);
const packageRoot = resolve(currentDirectory, '..');
const sourceRoot = resolve(packageRoot, 'src');
const resolverPath = resolve(sourceRoot, 'theme.resolver.json');
const EXPECTED_VERSION = '2025.10';
const EXPECTED_MODIFIERS = ['brand', 'scheme', 'contrast', 'motion'];
const MAX_THEME_PERMUTATIONS = 100;

async function readJsonFile(filePath) {
  const source = await readFile(filePath, 'utf-8');

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new Error(`El archivo JSON no es válido: ${filePath}.`, { cause: error });
  }
}

function validateResolverVersion(resolver) {
  if (resolver.version !== EXPECTED_VERSION) {
    const errorMessage = [
      'La versión del Theme Resolver no es válida.',
      `Esperada: ${EXPECTED_VERSION}.`,
      `Recibida: ${resolver.version ?? 'undefined'}.`,
    ].join(' ');

    throw new Error(errorMessage);
  }
}

function validateSets(resolver) {
  if (!resolver.sets || typeof resolver.sets !== 'object') {
    throw new Error('El Theme Resolver debe declarar "sets".');
  }

  const entries = Object.entries(resolver.sets);

  if (entries.length === 0) {
    throw new Error('El Theme Resolver debe declarar al menos un set.');
  }

  for (const [name, set] of entries) {
    if (!Array.isArray(set.sources)) {
      throw new Error(`El set "${name}" debe declarar un arreglo "sources".`);
    }

    if (set.sources.length === 0) {
      throw new Error(`El set "${name}" no contiene sources.`);
    }
  }
}

function validateModifier(modifierName, modifier) {
  if (!modifier) {
    throw new Error(`No se encontró el modifier requerido "${modifierName}".`);
  }

  if (!modifier.contexts || typeof modifier.contexts !== 'object') {
    throw new Error(`El modifier "${modifierName}" debe declarar "contexts".`);
  }

  const contextNames = Object.keys(modifier.contexts);

  if (contextNames.length === 0) {
    throw new Error(`El modifier "${modifierName}" no contiene contexts.`);
  }

  if (!modifier.default) {
    throw new Error(`El modifier "${modifierName}" debe declarar un contexto default.`);
  }

  if (!Object.hasOwn(modifier.contexts, modifier.default)) {
    const errorMessage = [
      `El contexto default "${modifier.default}"`,
      `no existe en el modifier "${modifierName}".`,
    ].join(' ');

    throw new Error(errorMessage);
  }

  for (const [contextName, sources] of Object.entries(modifier.contexts)) {
    if (!Array.isArray(sources)) {
      const errorMessage = [
        `El contexto "${contextName}"`,
        `del modifier "${modifierName}"`,
        'debe ser un arreglo.',
      ].join(' ');

      throw new Error(errorMessage);
    }
  }
}

function validateModifiers(resolver) {
  if (!resolver.modifiers || typeof resolver.modifiers !== 'object') {
    throw new Error('El Theme Resolver debe declarar "modifiers".');
  }

  for (const modifierName of EXPECTED_MODIFIERS) {
    validateModifier(modifierName, resolver.modifiers[modifierName]);
  }
}

function validateResolutionOrder(resolver) {
  if (!Array.isArray(resolver.resolutionOrder)) {
    throw new Error('El Theme Resolver debe declarar "resolutionOrder".');
  }

  if (resolver.resolutionOrder.length === 0) {
    throw new Error('"resolutionOrder" no puede estar vacío.');
  }

  for (const entry of resolver.resolutionOrder) {
    if (!entry || typeof entry.$ref !== 'string') {
      throw new Error('Cada entrada de "resolutionOrder" debe declarar "$ref".');
    }
  }

  for (const modifierName of EXPECTED_MODIFIERS) {
    const expectedReference = `#/modifiers/${modifierName}`;
    const exists = resolver.resolutionOrder.some((entry) => entry.$ref === expectedReference);

    if (!exists) {
      const errorMessage = ['"resolutionOrder" no contiene', `"${expectedReference}".`].join(' ');

      throw new Error(errorMessage);
    }
  }
}

async function validateExternalReferences(resolver) {
  const references = extractExternalReferences(resolver);

  for (const reference of references) {
    const target = resolve(sourceRoot, reference);

    try {
      await access(target);
    } catch {
      const errorMessage = ['No existe el archivo referenciado', `"${reference}".`].join(' ');

      throw new Error(errorMessage);
    }
  }
}

function validatePermutations() {
  const permutations = createThemePermutations();

  if (permutations.length === 0) {
    throw new Error('No se generaron combinaciones de themes.');
  }

  if (permutations.length > MAX_THEME_PERMUTATIONS) {
    const errorMessage = [
      'El número de combinaciones de themes',
      'supera el máximo permitido.',
      `Actual: ${permutations.length}.`,
      `Máximo: ${MAX_THEME_PERMUTATIONS}.`,
    ].join(' ');

    throw new Error(errorMessage);
  }

  const identifiers = permutations.map(({ brand, scheme, contrast, motion }) =>
    [brand, scheme, contrast, motion].join('-'),
  );
  const uniqueIdentifiers = new Set(identifiers);

  if (uniqueIdentifiers.size !== identifiers.length) {
    throw new Error('Se detectaron combinaciones de themes duplicadas.');
  }

  return permutations.length;
}

async function validateThemeResolver() {
  const resolver = await readJsonFile(resolverPath);

  validateResolverVersion(resolver);
  validateSets(resolver);
  validateModifiers(resolver);
  validateResolutionOrder(resolver);

  await validateExternalReferences(resolver);

  const resolvedThemes = await validateThemeResolutions();
  const permutations = validatePermutations();
  const message = [
    'Theme Resolver válido.',
    `${permutations} combinaciones verificadas.`,
    `${resolvedThemes} resoluciones verificadas.`,
  ].join(' ');

  console.log(message);
}

await validateThemeResolver();
