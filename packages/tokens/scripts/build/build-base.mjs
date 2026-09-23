import StyleDictionary from 'style-dictionary';

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

    options: {
      showFileHeader: false,
    },

    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'dist/css/',
        files: [
          {
            destination: 'base.css',
            format: 'css/variables',
          },
        ],
      },

      json: {
        transformGroup: 'js',
        buildPath: 'dist/json/',
        files: [
          {
            destination: 'base.json',
            format: 'json/nested',
          },
        ],
      },
    },
  });

  await dictionary.buildAllPlatforms();
}
