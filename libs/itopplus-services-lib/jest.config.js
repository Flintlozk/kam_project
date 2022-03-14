module.exports = {
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  collectCoverage: true,
  coverageReporters: ['text-summary'],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  globals: { 'ts-jest': { isolatedModules: true, tsconfig: '<rootDir>/tsconfig.spec.json' } },
  testEnvironment: 'node',
  coverageDirectory: '../../coverage/lib/itopplus-services-lib',
  displayName: 'itopplus-services-lib',
};
