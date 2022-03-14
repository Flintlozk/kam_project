module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/plusmar-back-end',
  globals: { 'ts-jest': { isolatedModules: true, tsconfig: '<rootDir>/tsconfig.spec.json' } },
  testEnvironment: 'node',
  displayName: 'plusmar-back-end',
};
