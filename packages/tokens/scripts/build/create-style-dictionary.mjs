import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';
import { durationCss } from './duration-css.mjs';
import { TOKEN_CONFIG } from '../../config/token-config.mjs';
import { createThemeSelector } from '../theme/create-theme-selector.mjs';

function createCssOptions(theme) {
  return {
    showFileHeader: false,
    outputReferences: false,
    ...(theme ? { selector: createThemeSelector(theme) } : {}),
  };
}

export function createStyleDictionary({ id, tokens, theme }) {
  const buildPath = `dist/themes/${id}/`;

  return new StyleDictionary({
    tokens,
    hooks: {
      transforms: {
        'duration/css': durationCss,
      },
    },

    log: {
      warnings: 'error',
      verbosity: 'default',
    },

    platforms: {
      css: {
        transformGroup: transformGroups.css,
        transforms: ['duration/css'],
        buildPath,
        prefix: TOKEN_CONFIG.cssVariablePrefix,
        files: [
          {
            destination: 'tokens.css',
            format: formats.cssVariables,
            options: createCssOptions(theme),
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
