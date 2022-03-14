import { IThaiPostShippingPriceChart } from '@reactor-room/itopplus-model-lib';
import mongoose, { Document, Schema } from 'mongoose';

export const thaiPostShippingPriceSchemaModel = mongoose?.model<IThaiPostShippingPriceChart & Document>(
  'thaipost_shipping_prices',
  new Schema({
    chartType: String,
    default: {
      '250': { type: Number },
      '500': { type: Number },
      '1000': { type: Number },
      '2000': { type: Number },
      '3500': { type: Number },
      '5000': { type: Number },
      '7500': { type: Number },
      '10000': { type: Number },
      '15000': { type: Number },
      '20000': { type: Number },
    },
    inSource: {
      '250': { type: Number },
      '500': { type: Number },
      '1000': { type: Number },
      '2000': { type: Number },
      '3500': { type: Number },
      '5000': { type: Number },
      '7500': { type: Number },
      '10000': { type: Number },
      '15000': { type: Number },
      '20000': { type: Number },
    },
    outSource: {
      '250': { type: Number },
      '500': { type: Number },
      '1000': { type: Number },
      '2000': { type: Number },
      '3500': { type: Number },
      '5000': { type: Number },
      '7500': { type: Number },
      '10000': { type: Number },
      '15000': { type: Number },
      '20000': { type: Number },
    },
  }),
);
