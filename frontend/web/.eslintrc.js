module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
  ],
  plugins: [
    'import',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
      },
    },
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020,
    requireConfigFile: false,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'space-before-function-paren': ['error', 'always'],
    'object-shorthand': ['error', 'never'],
    'max-len': 0,
    'no-underscore-dangle': 0,
    'no-shadow': 0,
    'linebreak-style': ['error', 'unix'],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'import/no-unresolved': 0,
    'import/extensions': 0,
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '*.ts', '*.tsx'],
      excludedFiles: '*.spec.ts',
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
      ],
      plugins: [
        '@typescript-eslint',
      ],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        project: './tsconfig.json',
        sourceType: 'module',
      },
      rules: {
        'import/prefer-default-export': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        'max-len': 0,
        '@typescript-eslint/explicit-member-accessibility': [
          'error', {
            accessibility: 'explicit',
            overrides: {
              accessors: 'explicit',
              constructors: 'no-public',
              methods: 'explicit',
              properties: 'off',
              parameterProperties: 'explicit',
            },
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 1,
      },
    },
    // VUE
    {
      files: ['*.vue', '**/*.vue', '**/*.js', '*.js'],
      excludedFiles: '*.spec.ts',
      extends: [
        'plugin:vue/vue3-essential',
        '@vue/typescript/recommended',
        'plugin:vue/vue3-recommended',
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: 0,
        'object-shorthand': ['error', 'never'],
        'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }],
        'vue/html-indent': ['error', 2, { baseIndent: 1 }],
        'vue/html-quotes': ['error', 'single'],
        'vue/max-attributes-per-line': ['error', { singleline: 5, multiline: { max: 1 } }],
        'no-underscore-dangle': 0,
        'func-names': 0,
        'vue/max-len': ['error', {
          code: 300,
          template: 300,
          tabWidth: 2,
          comments: 300,
          ignorePattern: '',
          ignoreComments: false,
          ignoreTrailingComments: false,
          ignoreUrls: false,
          ignoreStrings: false,
          ignoreTemplateLiterals: false,
          ignoreRegExpLiterals: false,
          ignoreHTMLAttributeValues: false,
          ignoreHTMLTextContents: false,
        }],
        'vue/valid-v-slot': ['error', {
          allowModifiers: true,
        }],
        '@typescript-eslint/explicit-function-return-type': 1,
      },
    },
  ],
};
