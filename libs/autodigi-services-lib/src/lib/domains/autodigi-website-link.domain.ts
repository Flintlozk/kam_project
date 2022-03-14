import { IAutodigiWebsite } from '@reactor-room/autodigi-models-lib';

export const mapAutodigiWebsiteLink = (websites: IAutodigiWebsite[]): string[] => {
  let link: string[] = [];
  if (websites.length > 0) {
    link = websites.map((website) => {
      return String(website._id);
    });

    return link;
  }
};
