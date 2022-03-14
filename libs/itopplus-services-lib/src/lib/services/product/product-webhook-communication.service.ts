import { HasProductVariant, IPayload, IProductVariantDB } from '@reactor-room/itopplus-model-lib';
import { getAudienceByID } from '../../data';
import * as productData from '../../data/product';
import { AudienceService } from '../audience/audience.service';
import { PipelineProductMessageService } from '../pipeline';
import { PlusmarService } from '../plusmarservice.class';
export class ProductWebhookCommunicationService {
  public pipelineProductMessageService: PipelineProductMessageService;
  public audienceService: AudienceService;

  constructor() {
    this.pipelineProductMessageService = new PipelineProductMessageService();
    this.audienceService = new AudienceService();
  }

  handleProductVariantRichMenu = async (payload: IPayload, psid: string, ref: string, audienceID: number): Promise<void> => {
    await this.pipelineProductMessageService.sendProductVariant(payload.pageID, audienceID, psid, ref, payload.subscriptionID);
    const _INBOX = true;
    const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, payload.pageID);
    await this.audienceService.autoSetAudienceStatus(payload, audience, _INBOX);
  };
  handleProductVariantRichMenuFromWebhook = async (pageID: number, psid: string, ref: string, audienceID: number, subscriptionID: string): Promise<void> => {
    await this.pipelineProductMessageService.sendProductVariant(pageID, audienceID, psid, ref, subscriptionID);
  };

  handleProductRichMenu = async (pageID: number, psid: string, ref: string, audienceID: number, subscriptionID: string): Promise<void> => {
    await this.pipelineProductMessageService.sendProduct({ pageID, subscriptionID }, audienceID, psid, ref);
  };

  hasProductVariant = async (pageID: number, ref: string): Promise<HasProductVariant> => {
    const variantAttributeIds = await productData.isProductVariantExists(PlusmarService.readerClient, pageID, ref);
    if (variantAttributeIds === null) {
      return HasProductVariant.NO_PRODUCT_FOUND;
    } else {
      console.log('//[LOG]: variantAttributeIds', variantAttributeIds);
      const hasVariant = variantAttributeIds.find((id) => id === -1);
      console.log('//[LOG]: hasVariant', hasVariant);
      return hasVariant === undefined ? HasProductVariant.YES_PRODUCT_VARIANT : HasProductVariant.NO_PRODUCT_VARIANT;
    }
  };

  getVariantFromProductRef = async (pageID: number, ref: string): Promise<IProductVariantDB> => {
    return await productData.getVariantFromProductRef(pageID, ref, PlusmarService.readerClient);
  };
}
