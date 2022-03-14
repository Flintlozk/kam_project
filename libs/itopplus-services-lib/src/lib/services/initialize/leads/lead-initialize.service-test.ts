// import { Pool } from 'pg';
// import * as datalead from '../../../data/leads';
// import { mock } from '../../../test/mock';
// import { PlusmarService } from '../../plusmarservice.class';
// import { LeadsInitializeService } from './leads-initialize.service';

// jest.mock('../../data/leads');
// jest.mock('../plusmarservice.class');

// describe('LeadInitializeService', () => {
//   let service: LeadsInitializeService;

//   beforeEach(() => {
//     service = new LeadsInitializeService();
//   });

//   test('should be created', async () => {
//     const pageID = 344;
//     PlusmarService.writerClient = ('READER' as unknown) as Pool;

//     const leadCreateFormResponse = {
//       id: 275,
//       name: 'Customer Form',
//       page_id: 344,
//       audience_id: null,
//       created_at: '2020-11-27 03:11:13.070781',
//       greeting_message: 'กรุณากรอกข้อมูลเพื่อใช้ในการติดต่อ',
//       thank_you_message: 'Thank you, We have received your contact.',
//       button_input: 'Enter Contact Info',
//       updated_at: '2020-11-27 03:11:13.070781',
//     };

//     const createLeadFormResponse = [
//       {
//         id: 275,
//         name: 'Customer Form',
//         page_id: 344,
//         audience_id: null,
//         created_at: '2020-11-27 03:11:13.070781',
//         greeting_message: 'กรุณากรอกข้อมูลเพื่อใช้ในการติดต่อ',
//         thank_you_message: 'Thank you, We have received your contact.',
//         button_input: 'Enter Contact Info',
//         updated_at: '2020-11-27 03:11:13.070781',
//       },
//     ];
//     mock(datalead, 'createForm', jest.fn().mockResolvedValue(leadCreateFormResponse));
//     mock(datalead, 'createFormComponent', jest.fn().mockResolvedValueOnce({}));
//     mock(datalead, 'createFormComponent', jest.fn().mockResolvedValueOnce({}));
//     mock(datalead, 'getFormsByPageID', jest.fn().mockResolvedValueOnce(createLeadFormResponse));

//     const result = await service.initLeadForm(pageID);
//     expect(datalead.createForm).toHaveBeenCalled();
//     expect(datalead.createFormComponent).toBeCalledTimes(2);
//     expect(datalead.getFormsByPageID).toHaveBeenCalled();

//     expect(result).toEqual(createLeadFormResponse);
//   });
// });
