import type { IGQLContext, ILotNumberArg, ILotNumberModel, ITrackingNumber } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { LotNumberService } from '@reactor-room/itopplus-services-lib';
import { validateLogisticID, validateLotNumberResponse, validateUpdatedLotNumbers } from '../../../schema/setting';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from '../../graphql-handler';
import { IHTTPResult } from '@reactor-room/model-lib';
import { validateResponseHTTPObject } from '../../../schema/common';

@requireScope([EnumAuthScope.SOCIAL])
class LotNumber {
  constructor() {
    LotNumber.lotNumberService = new LotNumberService();
  }
  public static instance;
  public static lotNumberService: LotNumberService;
  public static getInstance() {
    if (!LotNumber.instance) LotNumber.instance = new LotNumber();
    return LotNumber.instance;
  }

  //Query
  async getLotNumbersByLogisticIDHandler(parent, arg: ILotNumberArg, context: IGQLContext): Promise<ILotNumberModel[]> {
    const { logisitcId } = validateLogisticID<ILotNumberArg>(arg);
    return await LotNumber.lotNumberService.getLotNumbersByLogisticID(logisitcId);
  }

  // Mutation
  async updateLotNumbersHandler(parent, arg: ILotNumberArg, context: IGQLContext): Promise<IHTTPResult> {
    const { lotNumbers } = validateUpdatedLotNumbers<ILotNumberArg>(arg);
    return await LotNumber.lotNumberService.updateLotNumbers(lotNumbers);
  }
}

const lotNumber: LotNumber = new LotNumber();
export const lotNumberResolver = {
  Query: {
    getLotNumbersByLogisticID: graphQLHandler({
      handler: lotNumber.getLotNumbersByLogisticIDHandler,
      validator: validateLotNumberResponse,
    }),
  },
  Mutation: {
    updateLotNumbers: graphQLHandler({
      handler: lotNumber.updateLotNumbersHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
