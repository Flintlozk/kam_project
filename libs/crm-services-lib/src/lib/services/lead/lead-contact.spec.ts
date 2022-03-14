import { LeadService } from './lead-contact.service';
import { mock } from '../../test/mock';
import * as data from '../../data/lead/lead.data';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import { CrudType, IBusinessType, IContact, IHTTPResult, ILead, INoteLead, ITagLead, ITagLeadByCompany, IUserLoginDetail, IUUIDCompany } from '@reactor-room/crm-models-lib';

describe('leadcontact', () => {
  const reader = {
    readerClient: Pool,
  };

  const companycontact = [
    {
      name: 'test',
      email: 'test',
      phoneNumber: 'test',
    },
    {
      name: 'test1',
      email: 'test1',
      phoneNumber: 'test1',
    },
    {
      name: 'test1',
      email: 'test1',
      phoneNumber: 'test1',
    },
  ] as IContact[];
  const inputlist = [{ uuidCompany: '4' }] as IUUIDCompany[];
  const uuidCompany = '068c10e5-a03b-48c0-a2d0-e06d514cb06c';
  const isLead = {
    companyContactList: [
      {
        name: 'test',
        email: 'test',
        phoneNumber: 'test',
        lineId: '123',
      },
      {
        name: 'test1',
        email: 'test1',
        phoneNumber: 'test1',
        lineId: '123',
      },
      {
        name: 'test1',
        email: 'test1',
        phoneNumber: 'test1',
        lineId: '123',
      },
    ],
    tagLeadList: [{ tagname: 'test' }, { tagname: 'test' }, { tagname: 'test' }, { tagname: 'test' }],
    noteLeadList: [{ notedetail: 'test', noteid: 1 }],
  } as ILead;
  const userLoginData: IUserLoginDetail = { userId: 1, ownerId: 1, username: 'kosol', is_admin: true, profilePic: 'test' };
  const isLeadWithCRUD = {
    addressList: [
      {
        address: 'test',
        postalcode: '12345',
        city: 'test',
        province: 'test',
        district: 'test',
      },
      {
        address: 'test',
        postalcode: '12345',
        city: 'test',
        province: 'test',
        district: 'test',
      },
    ],
    companyContactList: [
      {
        name: 'test',
        email: 'test',
        phoneNumber: 'test',
        CRUD_TYPE: CrudType.ADD,
        lineId: '123',
      },
      {
        name: 'test1',
        email: 'test1',
        phoneNumber: 'test1',
        CRUD_TYPE: CrudType.EDIT,
        lineId: '123',
      },
      {
        name: 'test1',
        email: 'test1',
        phoneNumber: 'test1',
        CRUD_TYPE: CrudType.DELETE,
        lineId: '123',
      },
    ],
    tagLeadList: [
      { tagname: 'test', CRUD_TYPE: CrudType.DELETE },
      { tagname: 'test', CRUD_TYPE: CrudType.ADD },
      { tagname: 'test', CRUD_TYPE: CrudType.ADD },
      { tagname: 'test', CRUD_TYPE: CrudType.DELETE },
    ],
    noteLeadList: [{ notedetail: 'test' }],
  } as ILead;

  const isBusinessType = [{ businesstype: 'A' }, { businesstype: 'B' }, { businesstype: 'C' }, { businesstype: 'D' }] as IBusinessType[];

  const isLeadWithUUID = [
    {
      uuidCompany: '068c10e5-a03b-48c0-a2d0-e06d514cb06c',
      companyContactList: [
        {
          name: 'test',
          email: 'test',
          phoneNumber: 'test',
          lineId: '123',
        },
        {
          name: 'test1',
          email: 'test1',
          phoneNumber: 'test1',
          lineId: '123',
        },
        {
          name: 'test1',
          email: 'test1',
          phoneNumber: 'test1',
          lineId: '123',
        },
      ],
      tagLeadList: [{ tagname: 'test' }, { tagname: 'test' }, { tagname: 'test' }, { tagname: 'test' }],
      noteLeadList: [{ notedetail: 'test', noteid: 1 }],
      companyid: 1,
    },
  ] as ILead[];
  const mockPagination = { skip_number: 5, limit_number: 5 };
  const isTagLeadByCompany = [{ tagownerid: 1 }, { tagownerid: 2 }, { tagownerid: 3 }, { tagownerid: 4 }] as ITagLeadByCompany[];
  const isTagName = [{ tagname: 'test1' }, { tagname: 'test2' }, { tagname: 'test3' }, { tagname: 'test4' }];
  const isTagLeadByOwner = [
    { tagownerid: 1, tagname: 'test1' },
    { tagownerid: 2, tagname: 'test2' },
    { tagownerid: 3, tagname: 'test3' },
    { tagownerid: 4, tagname: 'test4' },
  ] as ITagLead[];
  const isNoteLead = [{ notedetail: 'test', noteid: 1 }] as INoteLead[];
  const httpReslt = { status: 200, value: '' } as IHTTPResult;
  test('getLeadsContact', async () => {
    mock(data, 'getLeadsContact', jest.fn().mockResolvedValue(isLead));
    const result = await LeadService.getLeadsContact(mockPagination, 1);
    expect(data.getLeadsContact).toHaveBeenCalled();
    expect(result).toBe(isLead);
  });
  test('getLeadsContact', async () => {
    mock(data, 'getInActiveLeadsContact', jest.fn().mockResolvedValue(isLead));
    const result = await LeadService.getInActiveLeadsContact(mockPagination, 1);
    expect(data.getInActiveLeadsContact).toHaveBeenCalled();
    expect(result).toBe(isLead);
  });
  test('getContactsByLead', async () => {
    mock(data, 'getContactByLead', jest.fn().mockResolvedValue(companycontact));
    const result = await LeadService.getContactsByLead(uuidCompany, 1);
    expect(data.getContactByLead).toHaveBeenCalled();
    expect(result).toBe(companycontact);
  });
  test('getPrimaryContactsbyLead', async () => {
    mock(data, 'getPrimaryContactByLead', jest.fn().mockResolvedValue(companycontact));
    const result = await LeadService.getPrimaryContactsbyLead(uuidCompany, 1);
    expect(data.getPrimaryContactByLead).toHaveBeenCalled();
    expect(result).toBe(companycontact);
  });
  test('getLeadsContactByUUIDCompany', async () => {
    mock(data, 'getLeadsContactByUUIDCompany', jest.fn().mockResolvedValue(isLead));
    const result = await LeadService.getLeadsContactByUUIDCompany(uuidCompany, 1);
    expect(data.getLeadsContactByUUIDCompany).toHaveBeenCalled();
    expect(result).toBe(isLead);
  });
  test('updateCompanyContactService', async () => {
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({ reader }));
    mock(data, 'updataeCompanyContactbyId', jest.fn().mockResolvedValue(isLeadWithUUID));
    mock(data, 'insertContactbyId', jest.fn().mockResolvedValue([]));
    mock(data, 'updataeContactbyId', jest.fn().mockResolvedValue([]));
    mock(data, 'deleteContactByNameId', jest.fn().mockResolvedValue([]));
    mock(data, 'insertTagLeadbyCompanyId', jest.fn().mockResolvedValue([]));
    mock(data, 'deleteTagLeadbyTagOwnerId', jest.fn().mockResolvedValue([]));
    mock(data, 'updateNoteLeadbyUuidNote', jest.fn().mockResolvedValue([]));
    mock(data, 'getTagLeadByOwner', jest.fn().mockResolvedValue([]));
    mock(data, 'insertTagOnwer', jest.fn().mockResolvedValue([{ tagOwnerId: 1 }]));
    mock(data, 'insertTagLeadbyCompanyId', jest.fn().mockResolvedValue([]));
    mock(data, 'updataeAddressbyId', jest.fn().mockResolvedValue([]));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));
    const result = await LeadService.updateCompanyContact(isLeadWithCRUD, 1);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalled();
    expect(data.updataeCompanyContactbyId).toBeCalledTimes(1);
    expect(data.insertContactbyId).toBeCalledTimes(1);
    expect(data.deleteContactByNameId).toBeCalledTimes(1);
    expect(data.insertTagLeadbyCompanyId).toBeCalledTimes(2);
    expect(data.deleteTagLeadbyTagOwnerId).toBeCalledTimes(0);
    expect(data.updateNoteLeadbyUuidNote).toBeCalledTimes(1);
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalled();
    expect(result).toStrictEqual(httpReslt);
  });
  test('insertCompanyContact', async () => {
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({ reader }));
    mock(data, 'insertCompanyContactbyId', jest.fn().mockResolvedValue({ uuidCompany }));
    mock(data, 'insertContactbyId', jest.fn().mockResolvedValue({}));
    mock(data, 'insertTagLeadbyCompanyId', jest.fn().mockResolvedValue({}));
    mock(data, 'insertNoteLeadbyCompanyId', jest.fn().mockResolvedValue({}));
    mock(data, 'getTagLeadByOwner', jest.fn().mockResolvedValue([]));
    mock(data, 'insertTagOnwer', jest.fn().mockResolvedValue({}));
    mock(data, 'selectCompanyDetailByProjectNumber', jest.fn().mockResolvedValue(null));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));
    const result = await LeadService.insertCompanyContact(isLead, userLoginData);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalled();
    expect(data.insertCompanyContactbyId).toHaveBeenCalled();
    expect(data.insertContactbyId).toHaveBeenCalledTimes(3);
    expect(data.insertTagLeadbyCompanyId).toHaveBeenCalledTimes(4);
    expect(data.insertNoteLeadbyCompanyId).toHaveBeenCalledTimes(1);
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalled();
    expect(result.uuidCompany).toBe(uuidCompany);
  });
  test('deleteCompanyContact', async () => {
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({ reader }));
    mock(PostgresHelper, 'joinInQueries', jest.fn().mockResolvedValue("('1fa74904-0637-4949-8f28-1e9af83c7e4f')"));
    mock(
      data,
      'getCompanyIdByUUIDCompany',
      jest.fn().mockResolvedValue([
        {
          companyid: 4,
        },
      ]),
    );
    mock(data, 'deleteCompanybyCompanyId', jest.fn().mockResolvedValue({}));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({ reader }));

    await LeadService.deleteCompanyContact(inputlist, 1);

    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalled();
    expect(PostgresHelper.joinInQueries).toHaveBeenCalled();
    expect(data.deleteCompanybyCompanyId).toHaveBeenCalled();
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalled();
  });
  test('getBusinessTypeByOwnerIdService', async () => {
    mock(data, 'getBusinessTypeByOwnerId', jest.fn().mockResolvedValue(isBusinessType));
    const result = await LeadService.getBusinessTypeByOwnerId(1);
    expect(data.getBusinessTypeByOwnerId).toHaveBeenCalled();
    expect(result).toBe(isBusinessType);
  });
  test('getTagLeadByCompanyId', async () => {
    mock(data, 'getTagLeadByCompanyId', jest.fn().mockResolvedValue(isTagLeadByCompany));
    mock(data, 'getTagLeadByOwner', jest.fn().mockResolvedValue(isTagLeadByOwner));
    const result = await LeadService.getTagLeadByCompanyId(uuidCompany, 1);
    expect(data.getTagLeadByCompanyId).toHaveBeenCalled();
    expect(data.getTagLeadByOwner).toHaveBeenCalled();
    expect(result).toStrictEqual(isTagName);
  });
  test('getNoteLeadByCompanyId', async () => {
    mock(data, 'getNoteLeadByCompanyId', jest.fn().mockResolvedValue(isNoteLead));
    const result = await LeadService.getNoteLeadByCompanyId(uuidCompany, 1);
    expect(data.getNoteLeadByCompanyId).toHaveBeenCalled();
    expect(result).toBe(isNoteLead);
  });
});
