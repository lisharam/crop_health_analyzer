module.exports = {
  testEnvironment: 'node',
  // Ignore the extracted-files directory (duplicate package.json/name causes haste collisions)
  modulePathIgnorePatterns: ['<rootDir>/extracted-files/'],
  verbose: true,
  testTimeout: 10000,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
};