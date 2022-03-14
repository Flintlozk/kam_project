import { getTopicLine } from './line-message.domain';

describe('getTopicLine()', () => {
  test('getTopicLine() should return plusmar-line-staging1', async () => {
    const topic = getTopicLine('82c3ade02734e0962c9e701674d1eaa1');
    expect(topic).toEqual('plusmar-line-staging1');
  });
  test('getTopicLine() should return plusmar-line-staging3', async () => {
    const topic = getTopicLine('6ca5e4058a6f2c1c33bf109e111993a7');
    expect(topic).toEqual('plusmar-line-staging3');
  });
  test('getTopicLine() should return plusmar-line-staging4', async () => {
    const topic = getTopicLine('b1da754e2bbabe13aa938cc33660c9aa');
    expect(topic).toEqual('plusmar-line-staging4');
  });

  test('getTopicLine() should return plusmar-line-staging5', async () => {
    const topic = getTopicLine('a9f53238892511c6c3a0bd8bcf45b5d7');
    expect(topic).toEqual('plusmar-line-staging5');
  });
  test('getTopicLine() should return plusmar-line-staging6 (traefik)', async () => {
    const topic = getTopicLine('8cd2b6be11086d516c4ee4e11d42fd29');
    expect(topic).toEqual('plusmar-line-staging6');
  });
  test('getTopicLine() should return plusmar-line-staging6 (mc_test_11)', async () => {
    const topic = getTopicLine('4ad144f0dd073152113206eb136e6ea1');
    expect(topic).toEqual('plusmar-line-staging6');
  });

  test('getTopicLine() should return empty string 1', async () => {
    const topic = getTopicLine('4ad144f0dd073152113206eb136e6ea1dasd');
    expect(topic).toEqual('plusmar-line-production');
  });
  test('getTopicLine() should return empty string 2', async () => {
    const topic = getTopicLine('sadsadsa');
    expect(topic).toEqual('plusmar-line-production');
  });
  test('getTopicLine() should return empty string 3', async () => {
    const topic = getTopicLine('132122312');
    expect(topic).not.toEqual('plusmar-line-staging6');
  });
});
