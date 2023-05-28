module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/recommended',
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
  rules: {
    'space-before-function-paren': ['error', 'always'],
    'object-shorthand': ['error', 'never'],
    'max-len': 0,
    'no-underscore-dangle': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-shadow': 0,
    'import/prefer-default-export': 0,
    'import/no-cycle': [2, { maxDepth: 1 }],
    'linebreak-style': ['error', 'unix'],
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '*.ts', '*.tsx'],
      excludedFiles: '*.spec.ts',
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
      ],
      plugins: [
        '@typescript-eslint',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/no-non-null-assertion': 0,
        'import/prefer-default-export': 0,
        'max-len': 0,
        'import/no-cycle': [2, { maxDepth: 1 }],
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
        'class-methods-use-this': ['error', {
          exceptMethods: [
            'toDomainProps',
            'toDatabaseEntity',
            'method',
          ],
        }],
        'no-underscore-dangle': ['error', { allow: ['_id'] }],
        'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
      },
    },
  ],
};
