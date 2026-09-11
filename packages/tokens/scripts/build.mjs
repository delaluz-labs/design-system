import StyleDictionary from 'style-dictionary';

StyleDictionary.registerTransform({
  name: 'delaluz/color/css',
  type: 'value',

  filter(token) {
    return token.$type === 'color' || token.type === 'color';
  },

  transform(token) {
    const value = token.$value ?? token.value;

    if (typeof value === 'string') {
      return value;
    }

    if (
      value &&
      typeof value === 'object' &&
      typeof value.hex === 'string'
    ) {
      return value.hex;
    }

    throw new Error(
      `No se pudo transformar el color "${token.path.join('.')}" a CSS.`
    );
  }
});

const config = {
  source: [
    'src/**/*.tokens.json'
  ],

  platforms: {
    css: {
      transformGroup: 'css',

      transforms: [
        'attribute/cti',
        'name/kebab',
        'delaluz/color/css'
      ],

      buildPath: 'dist/css/',

      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables'
        }
      ]
    },
    json: {
      transformGroup: 'js',
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested'
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/types/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6'
        }
      ]
    }
  }
};

const dictionary = new StyleDictionary(config);

await dictionary.buildAllPlatforms();
