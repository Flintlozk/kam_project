import { MenuPageSchemaModel } from '@reactor-room/cms-model-mongo-lib';
export const updateMenuPageHTML = async (pageID: number, html: string): Promise<void> => {
  const query = { pageID };
  const excuse = { $set: { html } };
  await MenuPageSchemaModel.updateOne(query, excuse);
};

export const getMenuPageHTML = async (pageID: number): Promise<string> => {
  const query = { pageID };
  const result = await MenuPageSchemaModel.findOne(query);
  return result?.html;
};
