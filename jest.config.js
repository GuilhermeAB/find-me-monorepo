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
    // {
    //   displayName: 'app2',
    //   testMatch: ['<rootDir>/apps/app2/tests/**/*.spec.ts'],
    //   // Add any other Jest configuration options specific to app2
    // },
    // Add more configurations for other apps or packages as needed
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
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10
  //   }
  // },
  // Optional: You can specify additional reporters for test results
  // reporters: [],
  // Optional: You can specify a custom resolver for test module dependencies
  // moduleNameMapper: {},
  // Optional: You can specify custom test environment configuration
  // testEnvironmentOptions: {}
};
