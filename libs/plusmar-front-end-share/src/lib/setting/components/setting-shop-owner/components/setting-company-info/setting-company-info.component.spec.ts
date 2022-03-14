import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslateModule } from '@ngx-translate/core';
import { EnumPageMemberType, PipelineStepTypeEnum } from '@reactor-room/itopplus-model-lib';
import { SettingCompanyInfoComponent } from './setting-company-info.component';

describe('SettingCompanyInfoComponent', () => {
  let spectator: Spectator<SettingCompanyInfoComponent>;
  const createComponent = createComponentFactory({
    component: SettingCompanyInfoComponent,
    declarations: [SettingCompanyInfoComponent],
    imports: [CommonModule, TranslateModule.forRoot(), MatTabsModule],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        companyInfo: {
          company_name: 'string',
          company_logo: 'string',
          branch_name: 'string',
          branch_id: 'string',
          tax_identification_number: 'string',
          tax_id: 1,
          phone_number: 'string',
          email: 'string',
          fax: 'string',
          address: 'string',
          post_code: 'string',
          sub_district: 'string',
          district: 'string',
          province: 'string',
          country: 'string',
        },
        isEditAvailable: false,
        shopDetails: {
          address: '6-148 Colonnade Road',
          amphoe: 'นาโพธิ์',
          country: 'Thailand',
          currency: 'THB (฿) Baht',
          district: 'บ้านดู่',
          email: 'support@eurocom.com',
          fb_page_id: '227391254046211',
          firstname: 'Kevin',
          language: 'TH - Thai',
          lastname: 'Honeyman',
          page_name: 'Thailand Online Marketing',
          post_code: '31230',
          province: 'บุรีรัมย์',
          shop_picture: 'https://scontent.fbkk13-1.fna.fbcdn.net/',
          social_facebook: '',
          social_lazada: '',
          social_line: '',
          social_shopee: '',
          tel: '6136567963',
          lineId: '',
          id: null,
          user_id: null,
          page_username: '',
          page_role: EnumPageMemberType.OWNER,
          flat_status: true,
          delivery_fee: 12,
          option: {
            access_token: 'string',
            advanced_settings: {
              auto_reply: true,
              direct_message: [
                {
                  type: PipelineStepTypeEnum.SELECT_BANK,
                  class: 'string',
                  label: 'string',
                  title: 'string',
                  image: 'string',
                  defaultLabel: 'string',
                  defaultTitle: 'string',
                },
              ],
            },
          },
          created_at: new Date(),
          updated_at: new Date(),
          uuid: 'asd559-5w565-x5aa98w',
          line_channel_accesstoken: 'string',
          line_channel_secret: 'string',
          benabled_api: false,
          api_client_id: 'string',
          api_client_secret: 'string',
        },
      },
    });
  });

  it.skip('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
