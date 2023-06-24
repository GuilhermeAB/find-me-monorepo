module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    // Add configurations for each app or package in your monorepo
    {
      displayName: 'standard',
      testMatch: ['<rootDir>/standard/**/*.spec.ts'],
    },
    {
      displayName: 'adapters',
      testMatch: ['<rootDir>/adapters/**/*.spec.ts'],
    },
    {
      displayName: 'packages',
      testMatch: ['<rootDir>/packages/**/*.spec.ts'],
    },
  ],
  // Optional: If you have any setup files or global configuration, you can specify them here
  // setupFiles: [],
  // Optional: If you want to ignore specific files or folders in the test run
  // testPathIgnorePatterns: [],
  // Optional: If you want to collect coverage information during tests
  // collectCoverage: true,
  // Optional: You can specify specific coverage thresholds
  // coverageThreshold: {
  //   global: {
  //     branches: 10,
  //     functions: 10,
  //     lines: 10,
  //     statements: -10,
  //   },
  // },
  // Optional: You can specify additional reporters for test results
  // reporters: [],
  // Optional: You can specify a custom resolver for test module dependencies
  // moduleNameMapper: {},
  // Optional: You can specify custom test environment configuration
  // testEnvironmentOptions: {}
  collectCoverageFrom: [
    '**/*.ts',
    '!**/node_modules/**',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!frontend/**',
    '!packages/repositories/**',
    '!packages/services/src/**/base/**',
    '!adapters/api/src/cert/**',
    '!adapters/api/src/controller/**',
    '!adapters/api/src/server/**',
    '!adapters/database/**',
    '!backend/**',
    '!packages/services/src/account/mailer/templates/**',
  ],
};
