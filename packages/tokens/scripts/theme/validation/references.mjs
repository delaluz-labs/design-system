function isExternalReference(source) {
  return typeof source?.$ref === 'string' && !source.$ref.startsWith('#');
}

function extractReferencesFromSources(sources) {
  return sources.filter(isExternalReference).map((source) => source.$ref);
}

function extractSetReferences(sets) {
  return Object.values(sets).flatMap((set) => extractReferencesFromSources(set.sources));
}

function extractModifierReferences(modifiers) {
  return Object.values(modifiers).flatMap((modifier) =>
    Object.values(modifier.contexts).flatMap(extractReferencesFromSources),
  );
}

export function extractExternalReferences(resolver) {
  const references = [
    ...extractSetReferences(resolver.sets),
    ...extractModifierReferences(resolver.modifiers),
  ];

  return [...new Set(references)];
}
