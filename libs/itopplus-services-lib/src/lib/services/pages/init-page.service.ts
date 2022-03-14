import { createMailOption, createTransporter } from '@reactor-room/itopplus-back-end-helpers';
import { EnumSubscriptionFeatureType, ICustomerTagCRUD, IPages, IPlanLimitAndDetails, IUserCredential } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { addPageMessagingTemplates, insertCustomerDefault, sendInvitationEmail } from '../../data';
import { ChatTemplatesInitializeService, LeadsInitializeService, LogisticsInitializeService, TaxInitializeService } from '../initialize';
import { PlusmarService } from '../plusmarservice.class';
export class InitPageService {
  public initLogisticService: LogisticsInitializeService;
  public initTaxService: TaxInitializeService;
  public initLeadService: LeadsInitializeService;
  public chatTemplatesService: ChatTemplatesInitializeService;

  constructor() {
    this.initLogisticService = new LogisticsInitializeService();
    this.initTaxService = new TaxInitializeService();
    this.initLeadService = new LeadsInitializeService();
    this.chatTemplatesService = new ChatTemplatesInitializeService();
  }

  setDefaultCommercePageSettings = async (client: Pool, pageID: number, page: IPages): Promise<void> => {
    try {
      const P1 = this.initLogisticService.initLogsitics(client, pageID, page);
      const P2 = this.initTaxService.initTax(client, pageID);
      const P3 = this.initLeadService.initLeadForm(client, pageID);
      await Promise.all([P1, P2, P3]);
      await this.chatTemplatesService.initChatTemplates(pageID);
      return;
    } catch (err) {
      console.log('-< err >- ', err);
      // TODO : Repeat Set Page Default Settings
      return;
    }
  };

  setDefaultBusinessPageSettings = async (client: Pool, pageID: number): Promise<void> => {
    try {
      const P1 = this.initTaxService.initTax(client, pageID);
      const P2 = this.initLeadService.initLeadForm(client, pageID);
      await Promise.all([P1, P2]);
      return;
    } catch (err) {
      console.log('-< err >- ', err);
      // TODO : Repeat Set Page Default Settings
      return;
    }
  };

  setPageCommonDefault = async (client: Pool, subscriptionDetail: IPlanLimitAndDetails, page: IPages): Promise<void> => {
    await addPageMessagingTemplates(client, page.id);
    if (subscriptionDetail.featureType === EnumSubscriptionFeatureType.BUSINESS) {
      await this.setDefaultBusinessPageSettings(client, page.id);
    } else {
      await this.setDefaultCommercePageSettings(client, page.id, page);
    }
    await this.addDefaultCustomerTagData(client, page.id);
  };

  async addDefaultCustomerTagData(client: Pool, pageID: number): Promise<void> {
    try {
      const customerTagData = this.getDefaultCustomerTagData();
      if (customerTagData.length > 0 && pageID) {
        for (let i = 0; i < customerTagData.length; i++) {
          const customerTagMappingItem = customerTagData[i];
          const { name, color } = customerTagMappingItem;
          await insertCustomerDefault(pageID, name, color, client);
        }
      }
    } catch (error) {
      console.log('Error in setting default customer tags', error);
    }
  }

  getDefaultCustomerTagData(): ICustomerTagCRUD[] {
    return [
      {
        name: 'แจ้งปัญหา',
        color: 'CODE_BF3F8C',
      },
      {
        name: 'พรีออเดอร์',
        color: 'CODE_53B1FF',
      },
      {
        name: 'ลูกค้าเก่า',
        color: 'CODE_4F7185',
      },
      {
        name: 'ลูกค้ารอสินค้า',
        color: 'CODE_FDCF2C',
      },
      {
        name: 'นัดติดต่อกลับ',
        color: 'CODE_544FE3',
      },
      {
        name: 'ลูกค้าหยาบคาย',
        color: 'CODE_FF7821',
      },
      {
        name: 'ลูกค้าซื้อบ่อย',
        color: 'CODE_62BD4F',
      },
    ];
  }

  sendAddNewPageReport = async (user: IUserCredential, page: IPages, totalUse: number): Promise<void> => {
    const to = 'Phol@itopplus.com;worawut@theiconweb.com;apithana@theiconweb.com;sartiya_ning@theiconweb.com;prancharee@plusacademy.online';
    const subject = 'More-commerce Shop Created Report';
    const htmlBody = `
    userID: ${user.id} <br />
    ชื่อ-นามสกุล: ${page.firstname} ${page.lastname} <br />
    email: ${page.email} <br />
    เบอร์โทรศัพท์: ${page.tel} <br />
    ที่อยู่: ${page.address} ${page.district} ${page.amphoe} ${page.province} ${page.post_code} <br />
    ชื่อร้านค้า: ${page.page_name} <br />
    วันและเวลา: ${new Date()} <br />
    จำนวนร้านค้าในปัจจุบัน (รวมถูกสร้างล่าสุด) : ${totalUse} <br />
    `;
    const invitationEmail = createMailOption(to, subject, htmlBody, []);
    const transporter = createTransporter(PlusmarService.environment.transporterConfig);
    await sendInvitationEmail(invitationEmail, transporter);
  };
}
