import mongoose, { Schema } from 'mongoose';
import { ILanguage } from '@reactor-room/cms-models-lib';

export const LanguageSchemaModel = mongoose?.model<ILanguage & Document>(
  'z_cms_language',
  new Schema({
    name: String,
    localName: String,
    icon: String,
    cultureUI: String,
  }),
);
