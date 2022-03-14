import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';

export const updatePatternCSS = (result: IContentManagementGeneralPattern): IContentManagementGeneralPattern => {
  const regex = /#tempPattern/gi;
  result.patternStyle.css = result.patternStyle.css.replace(regex, `[id="${result._id}"]`);
  return result;
};

export const getContentsCustomCSS = (_id: string, css: string): string => {
  const regex = /#tempContentId/gi;
  css = css.replace(regex, `[id="${_id}"]`);
  return css;
};
