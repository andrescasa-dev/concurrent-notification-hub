const path = require('path');

/** Repository root (this file lives in `test/jest/`). */
const repoRoot = path.resolve(__dirname, '../..');

/** @type {import('jest').Config} */
module.exports = {
  rootDir: path.join(repoRoot, 'src'),
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!migrations/**'],
  coverageDirectory: path.join(repoRoot, 'coverage'),
  testEnvironment: 'node',
};
