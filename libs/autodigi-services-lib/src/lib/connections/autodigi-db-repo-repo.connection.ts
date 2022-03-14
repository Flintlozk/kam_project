import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { AutodigiUserSchema, AutodigiWebsiteSchema, AutodigiWebstatSchema } from '@reactor-room/autodigi-model-mongo-lib';
import { EMongoModelNames, IAutodigiUser, IAutodigiWebsite, IAutodigiWebStats } from '@reactor-room/autodigi-models-lib';
import { Model } from 'mongoose';

export const AutodigiUserModel = (callback: (callback: Model<IAutodigiUser & Document>) => void) => {
  callback(PlusmarService.mongoAutodigiConnector?.model<IAutodigiUser & Document>(EMongoModelNames.USERS, AutodigiUserSchema));
};
export const AutodigiWebsiteModel = (callback: (callback: Model<IAutodigiWebsite & Document>) => void) => {
  callback(PlusmarService.mongoAutodigiConnector?.model<IAutodigiWebsite & Document>(EMongoModelNames.WEBSITES, AutodigiWebsiteSchema));
};

export const AutodigiWebStatModel = (callback: (callback: Model<IAutodigiWebStats & Document>) => void) => {
  PlusmarService.environment.production
    ? callback(PlusmarService.mongoAutodigiCosmosConnector.model<IAutodigiWebStats & Document>(EMongoModelNames.WEB_STATS, AutodigiWebstatSchema))
    : callback(PlusmarService.mongoAutodigiConnector.model<IAutodigiWebStats & Document>(EMongoModelNames.WEB_STATS, AutodigiWebstatSchema));
};
