function decodePointerSegment(segment) {
  return segment.replaceAll('~1', '/').replaceAll('~0', '~');
}

export function resolveInternalReference(resolver, reference) {
  if (!reference.startsWith('#/')) {
    throw new Error(`La referencia interna no es válida: ${reference}.`);
  }

  const segments = reference.slice(2).split('/').map(decodePointerSegment);
  let current = resolver;

  for (const segment of segments) {
    if (current === null || typeof current !== 'object' || !Object.hasOwn(current, segment)) {
      throw new Error(`No fue posible resolver "${reference}".`);
    }

    current = current[segment];
  }

  return current;
}
