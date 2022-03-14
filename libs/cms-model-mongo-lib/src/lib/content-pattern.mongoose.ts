import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';
import mongoose, { Schema, Document } from 'mongoose';

export const contentPatternSchemaModel = mongoose?.model<IContentManagementGeneralPattern & Document>(
  'z_cms_content_pattern',
  new Schema({
    patternUrl: String,
    patternName: String,
    patternStyle: {
      container: {
        gridTemplateColumns: String,
        gridTemplateRows: String,
        gridGap: String,
      },
      primary: {
        maxContent: Number,
        grid: {
          gridTemplateColumns: String,
          gridTemplateRows: String,
          gridGap: String,
        },
        status: Boolean,
      },
      secondary: {
        maxContent: Number,
        grid: {
          gridTemplateColumns: String,
          gridTemplateRows: String,
          gridGap: String,
        },
        status: Boolean,
      },
      css: String,
    },
  }),
);
