module.exports = {
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/itopplus-back-end-helpers',
  globals: { 'ts-jest': { isolatedModules: true, tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'itopplus-back-end-helpers',
};
