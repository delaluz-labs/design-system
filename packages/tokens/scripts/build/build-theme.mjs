import { createStyleDictionary } from './create-style-dictionary.mjs';

export async function buildTheme({ id, tokens }) {
  const dictionary = createStyleDictionary({ id, tokens });

  await dictionary.buildAllPlatforms();
}
