import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';

export function createStyleDictionary({ id, tokens }) {
  const buildPath = `dist/themes/${id}/`;

  return new StyleDictionary({
    tokens,

    log: {
      warnings: 'error',
      verbosity: 'default',
    },

    platforms: {
      css: {
        transformGroup: transformGroups.css,
        buildPath,
        files: [
          {
            destination: 'tokens.css',
            format: formats.cssVariables,
            options: {
              showFileHeader: false,
              selector: `[data-theme-id="${id}"]`,
              outputReferences: false,
            },
          },
        ],
      },

      json: {
        transformGroup: transformGroups.js,
        buildPath,
        files: [
          {
            destination: 'tokens.json',
            format: formats.jsonNested,
            options: {
              showFileHeader: false,
            },
          },
        ],
      },

      javascript: {
        transformGroup: transformGroups.js,
        buildPath,
        files: [
          {
            destination: 'tokens.js',
            format: formats.javascriptEsm,
            options: {
              showFileHeader: false,
            },
          },
        ],
      },
    },
  });
}
