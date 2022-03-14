import { ILeadsForm, ILeadsFormComponentInput, ILeadsFormComponentOptions } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { createForm, createFormComponent, getFormsByPageID } from '../../../data/leads';
import { nameControlValidation, nameLabelTranslation, phoneLabelTranslation, phoneNumberControlValidation } from '../../../domains/leads/leads-initialize.domain';
import { PagesError } from '../../../errors';
import { PlusmarService } from '../../plusmarservice.class';

export class LeadsInitializeService {
  async initLeadForm(client: Pool, pageID: number): Promise<ILeadsForm[]> {
    try {
      const leadForm = {
        name: 'Customer Form',
        page_id: pageID,
        greeting_message: 'กรุณากรอกข้อมูลเพื่อใช้ในการติดต่อ',
        button_input: 'ดำเนินการ',
        thank_you_message: 'ขอบคุณ เราได้รับข้อมูลสำหรับติดต่อกลับแล้ว',
      };
      const form = await createForm(client, leadForm);

      const nameLeadFormOption: ILeadsFormComponentOptions = {
        controlName: 'name',
        label: 'Name*',
        translation: nameLabelTranslation(),
        validation: nameControlValidation(),
      };
      const nameLeadForm: ILeadsFormComponentInput = {
        form_id: form.id,
        type: 'text',
        options: nameLeadFormOption,
        index: 0,
      };

      await createFormComponent(client, nameLeadForm);

      const phoneNumberLeadFormOption: ILeadsFormComponentOptions = {
        controlName: 'phoneNumber',
        label: 'Phone No.*',
        translation: phoneLabelTranslation(),
        validation: phoneNumberControlValidation(),
      };
      const phoneNumberLeadForm: ILeadsFormComponentInput = {
        form_id: form.id,
        type: 'tel',
        options: phoneNumberLeadFormOption,
        index: 1,
      };
      await createFormComponent(client, phoneNumberLeadForm);

      const createdLeadForms = await getFormsByPageID(PlusmarService.readerClient, pageID);
      return createdLeadForms;
    } catch (err) {
      throw new PagesError('FAIL_INIT_LEADS_FORM');
    }
  }
}
