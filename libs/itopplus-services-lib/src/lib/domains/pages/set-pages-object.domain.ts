import { IPages, IPagesSchema } from '@reactor-room/itopplus-model-lib';
export function setPagesObject(pages: [IPagesSchema]) {
  return pages.map((item) => {
    return {
      id: item.id,
      pageName: item.page_name,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  });
}
