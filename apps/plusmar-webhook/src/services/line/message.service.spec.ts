import * as domain from '../../domains/line/line-message.domain';
import * as helper from '@reactor-room/itopplus-back-end-helpers';
import { mock } from '../../test/mock';
import { LineMessageService } from './message.service';
jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('line publsih message', () => {
  test('success', async () => {
    const lineMessageService = new LineMessageService();
    const mockLineSecret = 'line-secret';
    const mockBody = 'mock-body';
    const mockSignature = 'mock-signature';
    mock(domain, 'getLineSignature', jest.fn().mockReturnValue(mockSignature));
    mock(helper, 'publishMessage', jest.fn().mockResolvedValue(true));
    const result = await lineMessageService.linePublishMessage(mockLineSecret, mockBody, mockSignature);
    expect(domain.getLineSignature).toBeCalled();
    expect(helper.publishMessage).toBeCalled();
    expect(result).toStrictEqual(true);
  });
  test('fail no line secret', async () => {
    const lineMessageService = new LineMessageService();
    const mockLineSecret = '';
    const mockBody = 'mock-body';
    const mockSignature = 'mock-signature';
    try {
      await lineMessageService.linePublishMessage(mockLineSecret, mockBody, mockSignature);
    } catch (err) {
      expect(err.message).toEqual('No line secret');
    }
  });
  test('line signature is not equal', async () => {
    const lineMessageService = new LineMessageService();
    const mockLineSecret = 'line-secret';
    const mockBody = 'mock-body';
    const mockSignature = 'mock-signature';
    const wrongSignature = 'wrong-signature';
    mock(domain, 'getLineSignature', jest.fn().mockReturnValue(mockSignature));
    try {
      await lineMessageService.linePublishMessage(mockLineSecret, mockBody, wrongSignature);
    } catch (err) {
      expect(err.message).toEqual('line signature is not equal');
    }
  });
});
