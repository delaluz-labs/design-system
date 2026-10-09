import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';
import { TOKEN_CONFIG } from '../../config/token-config.mjs';

export async function buildBase() {
  const dictionary = new StyleDictionary({
    source: [
      'src/primitive/spacing.tokens.json',
      'src/primitive/radius.tokens.json',
      'src/primitive/typography.tokens.json',
    ],

    log: {
      warnings: 'error',
      verbosity: 'default',
    },

    platforms: {
      css: {
        transformGroup: transformGroups.css,
        prefix: TOKEN_CONFIG.cssVariablePrefix,
        buildPath: 'dist/css/',
        files: [
          {
            destination: 'base.css',
            format: formats.cssVariables,
            options: {
              showFileHeader: false,
              outputReferences: false,
            },
          },
        ],
      },

      json: {
        transformGroup: transformGroups.js,
        buildPath: 'dist/json/',
        files: [
          {
            destination: 'base.json',
            format: formats.jsonNested,
            options: {
              showFileHeader: false,
            },
          },
        ],
      },
    },
  });

  await dictionary.buildAllPlatforms();
}
