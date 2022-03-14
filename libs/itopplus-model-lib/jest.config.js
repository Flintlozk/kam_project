// eslint-disable-next-line no-undef
module.exports = {
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/itopplus-model-lib',
  globals: { 'ts-jest': { isolatedModules: true, tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'itopplus-model-lib',
};
