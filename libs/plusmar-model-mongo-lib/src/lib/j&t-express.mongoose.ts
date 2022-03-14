import mongoose, { Document, Schema } from 'mongoose';
import { IJAndTJsonAddress } from '@reactor-room/itopplus-model-lib';
export const JTExpressAddressesSchemaModel = mongoose?.model<IJAndTJsonAddress & Document>(
  'jt_express_addresses',
  new Schema({
    city: String,
    area: String,
    area_code: Number,
    city_code: Number,
  }),
);
