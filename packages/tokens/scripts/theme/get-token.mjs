export function getToken(tokens, path) {
  const segments = path.split('.');
  let current = tokens;

  for (const segment of segments) {
    if (current === null || typeof current !== 'object' || !Object.hasOwn(current, segment)) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

export function getTokenValue(tokens, path) {
  const token = getToken(tokens, path);

  if (!token) {
    throw new Error(`No se encontró el token "${path}".`);
  }

  const value = token.$value ?? token.value;

  if (value === undefined) {
    throw new Error(`El token "${path}" no contiene un valor.`);
  }

  return value;
}
