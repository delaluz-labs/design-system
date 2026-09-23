function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function mergeTokenTrees(target, source) {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    const currentValue = result[key];

    if (isPlainObject(currentValue) && isPlainObject(value)) {
      result[key] = mergeTokenTrees(currentValue, value);
      continue;
    }

    result[key] = structuredClone(value);
  }

  return result;
}
