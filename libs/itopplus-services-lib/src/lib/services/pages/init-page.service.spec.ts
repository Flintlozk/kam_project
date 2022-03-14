import { environmentLib } from '@reactor-room/environment-services-backend';
import { Pool } from 'pg';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { InitPageService } from './init-page.service';

PlusmarService.environment = { ...environmentLib, pageKey: 'facebook012' };
jest.mock('../../errors');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../plusmarservice.class');

describe('Set Default setting For Page', () => {
  test('Should set default commerce page setting', async () => {
    PlusmarService.writerClient = {} as unknown as Pool;
    const initPageService = new InitPageService();
    mock(initPageService.initLogisticService, 'initLogsitics', jest.fn());
    mock(initPageService.initTaxService, 'initTax', jest.fn());
    mock(initPageService.initLeadService, 'initLeadForm', jest.fn());
    mock(initPageService.chatTemplatesService, 'initChatTemplates', jest.fn());

    await initPageService.setDefaultCommercePageSettings(PlusmarService.writerClient, 1);
    expect(initPageService.initLogisticService.initLogsitics).toHaveBeenCalledTimes(1);
    expect(initPageService.initTaxService.initTax).toHaveBeenCalledTimes(1);
    expect(initPageService.initLeadService.initLeadForm).toHaveBeenCalledTimes(1);
    expect(initPageService.chatTemplatesService.initChatTemplates).toHaveBeenCalledTimes(1);
  });

  test('Should set default business page setting', async () => {
    const initPageService = new InitPageService();
    mock(initPageService.initLogisticService, 'initLogsitics', jest.fn());
    mock(initPageService.initTaxService, 'initTax', jest.fn());
    mock(initPageService.initLeadService, 'initLeadForm', jest.fn());
    mock(initPageService.chatTemplatesService, 'initChatTemplates', jest.fn());

    await initPageService.setDefaultBusinessPageSettings(PlusmarService.writerClient, 1);
    expect(initPageService.initLogisticService.initLogsitics).not.toBeCalled();
    expect(initPageService.initTaxService.initTax).toHaveBeenCalledTimes(1);
    expect(initPageService.initLeadService.initLeadForm).toHaveBeenCalledTimes(1);
    expect(initPageService.chatTemplatesService.initChatTemplates).not.toBeCalled();
  });
});
