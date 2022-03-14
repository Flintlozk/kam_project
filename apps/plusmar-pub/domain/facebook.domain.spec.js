const { getDescription } = require('graphql');
const { getDeliveryFromMessage, getReadFromMessage, getEchoFromMessage, getStandByFromMessage, getMessageIDFromMessage } = require('./facebook.domain');
describe('Delivery Update Chaining', () => {
  it('1. should be work for undefine check', () => {
    const delivery = getDeliveryFromMessage({});

    expect(delivery).toEqual(undefined);
  });

  it('2. should be work for true check', () => {
    const delivery = getDeliveryFromMessage({
      entry: [
        {
          messaging: [
            {
              delivery: true,
            },
          ],
        },
      ],
    });

    expect(delivery).toEqual(true);
  });

  it('3. should be work for undefine check', () => {
    const delivery = getDeliveryFromMessage({
      entry: [],
    });

    expect(delivery).toEqual(undefined);
  });

  it('4. should be work for undefine check', () => {
    const delivery = getDeliveryFromMessage({
      entry: [
        {
          messaging: [],
        },
      ],
    });
    expect(delivery).toEqual(undefined);
  });
});

describe('Watermark case', () => {
  it('1. getWatermarkFromMessage should be work for undefine check', () => {
    const delivery = getReadFromMessage(undefined);

    expect(delivery).toEqual(undefined);
  });

  it('2. getWatermarkFromMessage should be work for undefine check', () => {
    const delivery = getReadFromMessage({});

    expect(delivery).toEqual(undefined);
  });

  it('3. getWatermarkFromMessage should be work for true check', () => {
    const delivery = getReadFromMessage({
      entry: [
        {
          messaging: [
            {
              delivery: {
                watermark: true,
              },
            },
          ],
        },
      ],
    });

    expect(delivery).toEqual(true);
  });

  it('4. getReadFromMessage should be work for undefine check', () => {
    const delivery = getReadFromMessage({});

    expect(delivery).toEqual(undefined);
  });

  it('5. getReadFromMessage should be work for undefine check', () => {
    const delivery = getReadFromMessage({
      entry: [],
    });

    expect(delivery).toEqual(undefined);
  });

  it('6. getReadFromMessage should be work for undefine check', () => {
    const delivery = getReadFromMessage({
      entry: [
        {
          messaging: [],
        },
      ],
    });

    expect(delivery).toEqual(undefined);
  });

  it('7. getReadFromMessage should be work for undefine check', () => {
    const delivery = getReadFromMessage({
      entry: [
        {
          messaging: [],
        },
      ],
    });

    expect(delivery).toEqual(undefined);
  });

  it('8. getWatermarkFromMessage should be work for undefine check', () => {
    const delivery = getReadFromMessage({
      entry: [
        {
          messaging: [
            {
              read: {},
            },
          ],
        },
      ],
    });

    expect(delivery).toEqual(undefined);
  });

  it('9. getWatermarkFromMessage should be work for undefine check', () => {
    const delivery = getReadFromMessage();

    expect(delivery).toEqual(undefined);
  });

  it('10. getWatermarkFromMessage anotype of watermark we found some time', () => {
    const mockupData = {
      entry: [
        {
          messaging: [
            {
              read: {
                watermark: 1598596827811,
              },
            },
          ],
        },
      ],
    };
    const delivery = getReadFromMessage(mockupData);
    expect(delivery).toEqual(1598596827811);
  });
});

describe('Echo test case', () => {
  it('1. Echo Exist test case must return is_echo', () => {
    const mockupWebHook = {
      entry: [
        {
          messaging: [
            {
              message: {
                mid: 'm_fpKRkj-Eu069YJvQpMnIQM9J7PNP9ezu54SIjcIhm-odmvyMY9bu4QbI8jb7kUprRkvesADakLF69Vv_AUVEiQ',
                is_echo: true,
                text: "Hi, thanks for contacting us. We've received your message and appreciate you reaching out.",
              },
            },
          ],
        },
      ],
    };
    const result = getEchoFromMessage(mockupWebHook);
    expect(result).toBe(true);
  });

  it('2. Echo Exist test case must return is_echo undefined', () => {
    const mockupWebHook = {
      entry: [
        {
          messaging: [
            {
              message: {
                mid: 'm_fpKRkj-Eu069YJvQpMnIQM9J7PNP9ezu54SIjcIhm-odmvyMY9bu4QbI8jb7kUprRkvesADakLF69Vv_AUVEiQ',
                text: "Hi, thanks for contacting us. We've received your message and appreciate you reaching out.",
              },
            },
          ],
        },
      ],
    };
    const result = getEchoFromMessage(mockupWebHook);
    expect(result).toBe(undefined);
  });
});

describe('Stand by test case', () => {
  it('1. is StandBy type must return standby', () => {
    const mockIncomingWebhook = {
      object: 'page',
      entry: [
        {
          id: '106821459400821',
          time: 1611658152179,
          standby: [
            {
              sender: { id: '2622191497882524' },
              recipient: { id: '106821459400821' },
              timestamp: 1611658152081,
              message: { mid: 'm_PREI5OJmftlHFQwDxceRKDl8Cot08lbsPY3YwZ_JbSJWswKkV_QBpFAbwH9FTeuBtIWGPhX7vVodAVx02P9Kfw', text: '1321' },
            },
          ],
        },
      ],
    };

    const mockResult = [
      {
        sender: { id: '2622191497882524' },
        recipient: { id: '106821459400821' },
        timestamp: 1611658152081,
        message: { mid: 'm_PREI5OJmftlHFQwDxceRKDl8Cot08lbsPY3YwZ_JbSJWswKkV_QBpFAbwH9FTeuBtIWGPhX7vVodAVx02P9Kfw', text: '1321' },
      },
    ];

    const result = getStandByFromMessage(mockIncomingWebhook);
    expect(result).toBe(mockResult);
  });

  it('2. is NOT! StandBy type must return undefined', () => {
    const mockIncomingWebhook = {
      object: 'page',
      entry: [
        {
          id: '106821459400821',
          time: 1611658152179,
          messaging: [
            {
              sender: { id: '2622191497882524' },
              recipient: { id: '106821459400821' },
              timestamp: 1611658152081,
              message: { mid: 'm_PREI5OJmftlHFQwDxceRKDl8Cot08lbsPY3YwZ_JbSJWswKkV_QBpFAbwH9FTeuBtIWGPhX7vVodAVx02P9Kfw', text: '1321' },
            },
          ],
        },
      ],
    };

    const result = getStandByFromMessage(mockIncomingWebhook);
    expect(result).toBe(undefined);
  });
});

describe('test getMessageIDFromMessage', () => {
  test('empty webhook', () => {
    const mockIncomingWebhook = '';
    const result = getMessageIDFromMessage(mockIncomingWebhook);
    expect(result).toBe(undefined);
  });
  test('good webhook', () => {
    const mockIncomingWebhook = {
      object: 'page',
      entry: [
        {
          id: '180850905258728',
          time: 1644824170483,
          messaging: [
            {
              sender: {
                id: '4727271380728334',
              },
              recipient: {
                id: '180850905258728',
              },
              timestamp: 1644824170194,
              message: {
                mid: 'm_xStcw4uczrO9pgWt24hyDHBeZLm6ZhLhXgd3be9QaYAZl_zaIM0p12WM6ZpZ4vAodCddsxn7hFw6kGYjoImNSw',
                text: 'Test',
              },
            },
          ],
        },
      ],
    };
    const result = getMessageIDFromMessage(mockIncomingWebhook);
    expect(result).toBe('m_xStcw4uczrO9pgWt24hyDHBeZLm6ZhLhXgd3be9QaYAZl_zaIM0p12WM6ZpZ4vAodCddsxn7hFw6kGYjoImNSw');
  });
});
