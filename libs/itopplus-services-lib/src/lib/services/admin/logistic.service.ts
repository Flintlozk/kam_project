import { IHTTPResult } from '@reactor-room/model-lib';
import { EnumLogisticOperator, IDropOffTrackingNumber, ILogisticsBundleInput, ILogisticsBundleSQLResponse, ILogisticsOperator } from '@reactor-room/itopplus-model-lib';
import { groupBy, isEmpty } from 'lodash';
import { Pool } from 'pg';
import { addLogisticBundle, deleteBundle, getDropOffTrackingNumber, getLogisticBundles, getLogisticOperators, setNextDropOffTrackingUsed } from '../../data';
import { PlusmarService } from '../plusmarservice.class';

const formatResponse = ([key, value]) => {
  return {
    key: key,
    title: value[0].title,
    bundles: value.map((item) => {
      item.from = String(item.from).padStart(8, '0');
      item.to = String(item.to).padStart(8, '0');
      return item;
    }),
    logistic_operator_id: value[0].logistic_operator_id,
    total: value.reduce((a: number, c) => (!a ? c.total : a + c.total), null),
    spent: value.reduce((a: number, c) => (!a ? c.spent : a + c.spent), null),
  };
};

export class AdminLogisticsService {
  constructor() {}

  async getLogisticBundles(): Promise<ILogisticsOperator[]> {
    const bundles: ILogisticsBundleSQLResponse[] = await getLogisticBundles(PlusmarService.writerClient);
    if (!isEmpty(bundles)) {
      const result = Object.entries(groupBy(bundles, 'key')).map(formatResponse);
      return result;
    } else {
      const operators = await getLogisticOperators(PlusmarService.writerClient);
      const defaultBundle = [];
      operators.map((item) => {
        defaultBundle.push({
          key: item.key,
          title: item.title,
          bundles: [],
          logistic_operator_id: item.id,
          total: 0,
          spent: 0,
        });
      });

      return defaultBundle;
    }
  }

  async deleteBundle(id: number): Promise<IHTTPResult> {
    await deleteBundle(PlusmarService.writerClient, id);
    return { status: 200, value: `${id} is deleted` };
  }

  async addLogisticBundle(input: ILogisticsBundleInput): Promise<IHTTPResult> {
    const fromPrefix = `E${input.from.slice(0, 1)}`;
    const from = input.from.slice(1);
    const to = input.to.slice(1);
    const suffix = 'TH';

    const params = {
      ...input,
      from,
      to,
      total: Number(to) - Number(from),
      spent: 0,
      suffix,
      prefix: fromPrefix,
    };
    const [result]: [{ id: number }] = await addLogisticBundle(PlusmarService.writerClient, params);
    return { status: 200, value: `${result.id} is added` };
  }

  async getThaiPostDropOffTrackingNumber(client: Pool): Promise<IDropOffTrackingNumber> {
    const result = await getDropOffTrackingNumber(client, EnumLogisticOperator.THAIPOST); // 1 = Thaipost operator key
    return result[0];
  }
  async getThaiPostCODDropOffTrackingNumber(client: Pool): Promise<IDropOffTrackingNumber> {
    const result = await getDropOffTrackingNumber(client, EnumLogisticOperator.THAIPOST_COD); // 4 = Thaipost COD operator key
    return result[0];
  }
  async setNextDropOffTrackingUsed(client: Pool, id: number): Promise<void> {
    await setNextDropOffTrackingUsed(client, EnumLogisticOperator.THAIPOST, id); // 1 = Thaipost operator key
  }
  async setNextCODDropOffTrackingUsed(client: Pool, id: number): Promise<void> {
    await setNextDropOffTrackingUsed(client, EnumLogisticOperator.THAIPOST_COD, id); // 1 = Thaipost operator key
  }
}
