function validateKnownModifiers(modifiers, input) {
  for (const name of Object.keys(input)) {
    if (!Object.hasOwn(modifiers, name)) {
      throw new Error(`El modifier "${name}" no existe.`);
    }
  }
}

function validateContext(name, modifier, value) {
  if (!Object.hasOwn(modifier.contexts, value)) {
    throw new Error(`El contexto "${value}" no existe en el modifier "${name}".`);
  }
}

function getModifierValue(name, modifier, input) {
  const value = input[name] ?? modifier.default;

  if (value === undefined) {
    throw new Error(`El modifier "${name}" requiere un valor y no tiene default.`);
  }

  return value;
}

export function validateResolverInput(resolver, input) {
  const modifiers = resolver.modifiers ?? {};
  validateKnownModifiers(modifiers, input);
  const normalizedInput = {};

  for (const [name, modifier] of Object.entries(modifiers)) {
    const value = getModifierValue(name, modifier, input);
    validateContext(name, modifier, value);
    normalizedInput[name] = value;
  }

  return normalizedInput;
}
