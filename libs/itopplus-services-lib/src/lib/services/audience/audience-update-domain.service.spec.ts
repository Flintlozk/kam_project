import { AudienceDomainType, IAudience, ICustomerTemp } from '@reactor-room/itopplus-model-lib';
import * as data from '../../data';
import { mock } from '../../test/mock';
import * as audienceService from './audience-update-domain.service';
import { AudienceUpdateDomainService, exampleTest } from './audience-update-domain.service';
const audience = new AudienceUpdateDomainService();
jest.mock('../../data');

describe('Audience Update Domain Service', () => {
  test('moveAudience return Audience when DomainIS Other', async () => {
    mock(data, 'getCustomerByaudienceID', jest.fn().mockResolvedValueOnce({ id: 1 } as ICustomerTemp));
    mock(data, 'getAudienceByCustomerID', jest.fn().mockResolvedValueOnce({ id: 1 } as IAudience));
    const domainType = AudienceDomainType.AUDIENCE;
    const result = await audience.moveAudienceDomain(1, { pageID: 1, name: 'Admin Name', userID: 1 }, domainType);
    expect(result.id).toEqual(1);
  });
});
describe('Audience Update Domain Service', () => {
  test('moveAudience return undefined when customer is not exist', async () => {
    mock(data, 'getCustomerByaudienceID', jest.fn().mockResolvedValueOnce(undefined));
    const domainType = AudienceDomainType.AUDIENCE;
    const result = await audience.moveAudienceDomain(1, { pageID: 1, name: 'Admin Name', userID: 1 }, domainType);
    expect(result).toEqual(undefined);
  });
});
describe('Audience Update Domain Service', () => {
  test('moveAudience return undefined when audience is undefined', async () => {
    mock(data, 'getCustomerByaudienceID', jest.fn().mockResolvedValueOnce({ id: 1 } as ICustomerTemp));
    mock(data, 'getAudienceByCustomerID', jest.fn().mockResolvedValueOnce(undefined));
    const domainType = AudienceDomainType.AUDIENCE;
    const result = await audience.moveAudienceDomain(1, { pageID: 1, name: 'Admin Name', userID: 1 }, domainType);
    expect(result).toEqual(undefined);
  });
  test('example case of mock self function', () => {
    const spy = jest.spyOn(audienceService, 'exampleTest');
    spy.mockImplementation((dataParam) => 'HELLO' + dataParam);
    expect(exampleTest('1234')).toEqual('HELLO1234');
  });
});

// Server -->
// Steaming -->
// Network -->
// Disk -->
