import { ComponentTypeEnum, EWebPageLandingName } from '@reactor-room/cms-models-lib';

export const getLandingNameByComponentType = (componentType: ComponentTypeEnum): EWebPageLandingName => {
  switch (componentType) {
    case ComponentTypeEnum.CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING:
      return EWebPageLandingName.CONTENTMANAGEMENT;
    default:
      return null;
  }
};
