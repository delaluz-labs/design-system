import { createStyleDictionary } from './create-style-dictionary.mjs';

export async function buildTheme({ id, theme, tokens }) {
  const dictionary = createStyleDictionary({ id, theme, tokens });

  await dictionary.buildAllPlatforms();
}
