import { IContentManagementLandingPattern } from '@reactor-room/cms-models-lib';
import mongoose, { Schema, Document } from 'mongoose';

export const contentPatternLandingSchemaModel = mongoose?.model<IContentManagementLandingPattern & Document>(
  'z_cms_content_pattern_landing',
  new Schema({
    patternUrl: String,
    patternName: String,
    html: String,
    css: String,
  }),
);
