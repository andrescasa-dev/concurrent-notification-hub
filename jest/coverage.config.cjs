const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

/** @type {import('jest').Config} */
module.exports = {
  rootDir: repoRoot,
  coverageDirectory: path.join(repoRoot, 'coverage'),
  /**
   * With `projects`, root-level collectCoverageFrom does not merge correctly with
   * per-project rootDir (e.g. unit hits under `common/...` vs `src/common/...`).
   * Define collectCoverageFrom on each project so coverage maps align.
   */
  projects: [
    {
      displayName: 'unit',
      rootDir: path.join(repoRoot, 'src'),
      moduleFileExtensions: ['js', 'json', 'ts'],
      testEnvironment: 'node',
      testRegex: String.raw`.*\.spec\.ts$`,
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      collectCoverageFrom: [
        '**/*.ts',
        '!**/*.spec.ts',
        '!**/*.e2e-spec.ts',
        '!migrations/**',
      ],
    },
    {
      displayName: 'integration',
      rootDir: repoRoot,
      moduleFileExtensions: ['js', 'json', 'ts'],
      testEnvironment: 'node',
      testRegex: String.raw`.*\.e2e-spec\.ts$`,
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      setupFiles: ['<rootDir>/test/utils/load-env-test.ts'],
      globalSetup: '<rootDir>/test/utils/setup.ts',
      maxWorkers: 1,
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/test/'],
      collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
        '!src/**/*.e2e-spec.ts',
        '!src/migrations/**',
      ],
    },
  ],
};
