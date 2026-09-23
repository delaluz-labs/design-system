const ALIAS_PATTERN = /\{[^{}]+\}/;

function containsAlias(value) {
  if (typeof value === 'string') {
    return ALIAS_PATTERN.test(value);
  }

  if (Array.isArray(value)) {
    return value.some(containsAlias);
  }

  if (value !== null && typeof value === 'object') {
    return Object.values(value).some(containsAlias);
  }

  return false;
}

export function validateResolvedAliases(dictionary) {
  const unresolved = [];

  for (const token of dictionary.allTokens) {
    if (containsAlias(token.value)) {
      unresolved.push(token.path.join('.'));
    }
  }

  if (unresolved.length > 0) {
    throw new Error(`Se detectaron aliases sin resolver: ${unresolved.join(', ')}`);
  }

  return dictionary.allTokens.length;
}
