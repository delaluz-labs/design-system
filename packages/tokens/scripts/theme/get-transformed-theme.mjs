import { createStyleDictionary } from '../build/create-style-dictionary.mjs';
import { createThemeId } from './create-theme-id.mjs';
import { resolveThemeTokens } from './resolver/resolve-theme.mjs';

export async function getTransformedTheme(theme, platform = 'javascript') {
  const id = createThemeId(theme);
  const { tokens } = await resolveThemeTokens(theme);
  const dictionary = createStyleDictionary({ id, tokens });
  const transformed = await dictionary.getPlatformTokens(platform);

  return { id, theme, dictionary: transformed };
}
