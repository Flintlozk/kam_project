module.exports = {
  verbose: true,
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/plusmar-webhook',
  globals: { 'ts-jest': { isolatedModules: true, tsconfig: '<rootDir>/tsconfig.spec.json' } },
  testEnvironment: 'node',
  displayName: 'plusmar-webhook',
};
