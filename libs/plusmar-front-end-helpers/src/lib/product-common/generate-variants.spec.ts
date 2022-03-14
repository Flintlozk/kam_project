import { generateVariants } from './generate-variants';

describe('generateVariants', () => {
  test('Variant combination test', () => {
    const variantInput = getVariantInput();
    const expectedData = getExpectedData();
    const variantData = generateVariants(variantInput);
    expect(new Set(variantData)).toEqual(new Set(expectedData));
  });

  test('Variant empty  test', () => {
    const variantInput = [];
    const expectedData = [];
    const variantData = generateVariants(variantInput);
    expect(new Set(variantData)).toEqual(new Set(expectedData));
  });
});

const getVariantInput = () => {
  return [
    [
      { id: 725, name: 'Row', currentIndex: 0 },
      { id: 726, name: 'Mow', currentIndex: 0 },
    ],
    [
      { id: 723, name: 'eng', currentIndex: 1 },
      { id: 720, name: 'thai', currentIndex: 1 },
      { id: 724, name: 'hindi', currentIndex: 1 },
    ],
  ];
};

const getExpectedData = () => {
  return [
    [
      { id: 725, name: 'Row', currentIndex: 0 },
      { id: 723, name: 'eng', currentIndex: 1 },
    ],
    [
      { id: 725, name: 'Row', currentIndex: 0 },
      { id: 720, name: 'thai', currentIndex: 1 },
    ],
    [
      { id: 725, name: 'Row', currentIndex: 0 },
      { id: 724, name: 'hindi', currentIndex: 1 },
    ],
    [
      { id: 726, name: 'Mow', currentIndex: 0 },
      { id: 723, name: 'eng', currentIndex: 1 },
    ],
    [
      { id: 726, name: 'Mow', currentIndex: 0 },
      { id: 720, name: 'thai', currentIndex: 1 },
    ],
    [
      { id: 726, name: 'Mow', currentIndex: 0 },
      { id: 724, name: 'hindi', currentIndex: 1 },
    ],
  ];
};
