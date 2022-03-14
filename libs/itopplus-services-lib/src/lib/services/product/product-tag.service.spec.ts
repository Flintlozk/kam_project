import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IProductTag } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as data from '../../data/product';
import { mock } from '../../test/mock';
import { ProductTagService } from './product-tag.service';
jest.mock('../../data/product');
jest.mock('@reactor-room/itopplus-back-end-helpers');
const productTagService = new ProductTagService();
describe('Product tag  service', () => {
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));

  const tagData: IProductTag = { id: 553, name: 'ew', page_id: 2, active: false };

  test('update with inactive tag', async () => {
    mock(data, 'getTagByName', await jest.fn().mockResolvedValue(tagData as IProductTag));
    const result = await productTagService.editProductTag(542, 'ew', 2);
    expect(result).toEqual({ status: 403, value: 'pro_tag_inactive_state' });
  });

  test('update tag success', async () => {
    mock(data, 'getTagByName', await jest.fn().mockResolvedValue(null));
    mock(data, 'executeEditProductTag', await jest.fn().mockResolvedValue(null));
    mock(data, 'commitProductQueries', await jest.fn().mockResolvedValue({ status: 200, value: 'pro_tag_update_success' }));
    const result = await productTagService.editProductTag(548, 'wow', 2);
    expect(result).toEqual({ status: 200, value: 'pro_tag_update_success' });
  });
});
