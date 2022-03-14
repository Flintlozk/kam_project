import {
  CrudType,
  IAddress,
  IBusinessType,
  ICount,
  IGQLFileSteam,
  IHTTPResult,
  IInsertLeadRespone,
  ILead,
  ILeadSettings,
  INoteLead,
  IPaginationPage,
  ITagLead,
  ITagLeadByCompany,
  ITagNameByCompany,
  IUserLoginDetail,
  IUUIDCompany,
  ResponseValue,
  TagOwner,
} from '@reactor-room/crm-models-lib';
import {
  getContactByLead,
  deleteContactByNameId,
  getLeadsContact,
  getPrimaryContactByLead,
  insertCompanyContactbyId,
  insertContactbyId,
  updataeCompanyContactbyId,
  updataeContactbyId,
  getCompanyIdByUUIDCompany,
  getTagLeadByOwner,
  insertTagLeadbyCompanyId,
  getNoteLeadByCompanyId,
  insertNoteLeadbyCompanyId,
  getLeadsContactByUUIDCompany,
  getBusinessTypeByOwnerId,
  updateNoteLeadbyUuidNote,
  deleteTagLeadbyTagOwnerId,
  getTagLeadByCompanyId,
  deleteCompanybyCompanyId,
  insertTagOnwer,
  getInActiveLeadsContact,
  countActiveLead,
  countInActiveLead,
  insertAddressById,
  getAdressByLead,
  updataeAddressbyId,
  getLeadSettingsByOwner,
  selectCompanyDetailByProjectNumber,
} from '../../data/lead/lead.data';
import { IContact } from '@reactor-room/crm-models-lib';
import { isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { getS3FileFromBucket, setFileToS3Bucket } from '../../data/files';
import { CrmService } from '../crmservice.class';

export class LeadService {
  constructor() {}
  public static getLeadSettingsByOwner = async (ownerId: number): Promise<ILeadSettings> => {
    return await getLeadSettingsByOwner(CrmService.readerClient, ownerId);
  };
  public static getLeadsContact = async (pagination: IPaginationPage, ownerId: number): Promise<ILead[]> => {
    return await getLeadsContact(CrmService.readerClient, pagination, ownerId);
  };
  public static getInActiveLeadsContact = async (pagination: IPaginationPage, ownerId: number): Promise<ILead[]> => {
    return await getInActiveLeadsContact(CrmService.readerClient, pagination, ownerId);
  };
  public static getTotalLead = async (ownerId: number): Promise<ICount> => {
    const activeLead = await countActiveLead(CrmService.readerClient, ownerId);
    const inActiveLead = await countInActiveLead(CrmService.readerClient, ownerId);
    const data = { activeLead: 0, inActiveLead: 0 };
    data.activeLead = activeLead.activeLead;
    data.inActiveLead = inActiveLead.inActiveLead;
    return data;
  };
  public static getContactsByLead = async (uuidCompany: string, ownerId: number): Promise<IContact[]> => {
    return await getContactByLead(CrmService.readerClient, uuidCompany, ownerId);
  };
  public static getAdressByLead = async (uuidCompany: string, ownerId: number): Promise<IAddress[]> => {
    return await getAdressByLead(CrmService.readerClient, uuidCompany, ownerId);
  };
  public static getPrimaryContactsbyLead = async (uuidCompany: string, ownerId: number): Promise<IContact[]> => {
    if (!isEmpty(uuidCompany)) {
      return await getPrimaryContactByLead(CrmService.readerClient, uuidCompany, ownerId);
    } else {
      return null;
    }
  };
  public static getLeadsContactByUUIDCompany = async (arg: string, ownerId: number): Promise<ILead[]> => {
    return await getLeadsContactByUUIDCompany(CrmService.readerClient, arg, ownerId);
  };
  public static updateCompanyContact = async (arg: ILead, ownerId: number): Promise<IHTTPResult> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(CrmService.writerClient);
      const companyidlist = await updataeCompanyContactbyId(client, arg, ownerId);
      const companyContactList = arg.companyContactList;
      const companyid = companyidlist[0].companyId;
      for (const address of arg.addressList) {
        await updataeAddressbyId(client, address, ownerId);
      }
      let i;
      for (i = 0; i < companyContactList.length; i++) {
        if (companyContactList[i].CRUD_TYPE === CrudType.ADD) {
          await insertContactbyId(client, companyContactList[i], companyid, ownerId);
        } else if (companyContactList[i].CRUD_TYPE === CrudType.EDIT) {
          await updataeContactbyId(client, companyContactList[i], ownerId);
        } else if (companyContactList[i].CRUD_TYPE === CrudType.DELETE) {
          await deleteContactByNameId(client, companyContactList[i], ownerId);
        }
      }
      const tagOwnerObject = await getTagLeadByOwner(client, ownerId);
      for (i = 0; i < arg.tagLeadList.length; i++) {
        if (arg.tagLeadList[i].CRUD_TYPE === CrudType.ADD) {
          tagOwnerObject.forEach(async (tagOwner) => {
            if (tagOwner.tagname === arg.tagLeadList[i].tagname) {
              await insertTagLeadbyCompanyId(client, tagOwner.tagownerid, companyid, ownerId);
            }
          });
          const tagOwnerList = tagOwnerObject.map((TagOwnerName) => TagOwnerName.tagname);
          if (!tagOwnerList.includes(arg.tagLeadList[i].tagname)) {
            const tagOwnerId = await insertTagOnwer(client, arg.tagLeadList[i].tagname, ownerId);
            await insertTagLeadbyCompanyId(client, tagOwnerId.tagOwnerId, companyid, ownerId);
          }
        } else if (arg.tagLeadList[i].CRUD_TYPE === CrudType.DELETE) {
          tagOwnerObject.forEach(async (tagOwnerDelete) => {
            if (tagOwnerDelete.tagname === arg.tagLeadList[i].tagname) {
              await deleteTagLeadbyTagOwnerId(client, tagOwnerDelete.tagownerid, companyid, ownerId);
            }
          });
        }
      }
      for (i = 0; i < arg.noteLeadList.length; i++) {
        await updateNoteLeadbyUuidNote(client, arg.noteLeadList[i], ownerId);
      }
      await PostgresHelper.execBatchCommitTransaction(client);
      return { status: 200, value: '' } as IHTTPResult;
    } catch (error) {
      throw { status: 403, value: error } as IHTTPResult;
    }
  };
  public static insertCompanyContact = async (lead: ILead, userData: IUserLoginDetail): Promise<IInsertLeadRespone> => {
    const client = await PostgresHelper.execBeginBatchTransaction(CrmService.writerClient);
    const project = await selectCompanyDetailByProjectNumber(client, lead.projectNumber, userData.ownerId);
    if (project) {
      throw Error(ResponseValue.DUPLICATE_PROJECT_CODE);
    }
    const companyprofile = await insertCompanyContactbyId(client, lead, userData.ownerId, userData.userId);
    const uuidCompany = companyprofile.uuidCompany;
    const company_id = companyprofile.companyId;
    const companyContactList = lead.companyContactList;
    const tagLeadList = lead.tagLeadList;
    const noteLeadList = lead.noteLeadList;
    let i;
    for (i = 0; i < companyContactList.length; i++) {
      await insertContactbyId(client, companyContactList[i], company_id, userData.ownerId);
    }
    for (const index in lead.addressList) {
      if (index) {
        await insertAddressById(client, lead.addressList[index], company_id, userData.ownerId, index);
      }
    }
    let j;

    for (j = 0; j < tagLeadList.length; j++) {
      const tagOwnerObject = await getTagLeadByOwner(client, userData.ownerId);
      tagOwnerObject.forEach(async (tagOwner) => {
        if (tagOwner.tagname === tagLeadList[j].tagname) {
          await insertTagLeadbyCompanyId(client, tagOwner.tagownerid, company_id, userData.ownerId);
        }
      });
      const tagOwnerList = tagOwnerObject.map((TagOwnerName) => TagOwnerName.tagname);
      if (!tagOwnerList.includes(tagLeadList[j].tagname)) {
        const tagOwnerId = await insertTagOnwer(client, tagLeadList[j].tagname, userData.ownerId);
        await insertTagLeadbyCompanyId(client, tagOwnerId.tagOwnerId, company_id, userData.ownerId);
      }
    }
    let k;
    for (k = 0; k < noteLeadList.length; k++) {
      await insertNoteLeadbyCompanyId(client, noteLeadList[k], company_id, userData.ownerId);
    }
    await PostgresHelper.execBatchCommitTransaction(client);
    return { uuidCompany: uuidCompany, createBy: userData.username, profilePic: userData.profilePic } as IInsertLeadRespone;
  };

  public static deleteCompanyContact = async (args: IUUIDCompany[], ownerId: number): Promise<IHTTPResult> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(CrmService.writerClient);
      const uuidCompanyList = args.map((arg) => arg.uuidCompany);
      const uuidCompanyqueries = PostgresHelper.joinInQueries(uuidCompanyList);
      const companyid = await getCompanyIdByUUIDCompany(client, uuidCompanyqueries, ownerId);
      const companyidlist = companyid.map((arg) => arg.companyid);
      const companyidqueries = PostgresHelper.joinInQueries(companyidlist);
      await deleteCompanybyCompanyId(client, companyidqueries, ownerId);
      await PostgresHelper.execBatchCommitTransaction(client);
      return { status: 200, value: '' } as IHTTPResult;
    } catch (error) {
      throw { status: 403, value: error } as IHTTPResult;
    }
  };

  public static getBusinessTypeByOwnerId = async (ownerId: number): Promise<IBusinessType[]> => {
    return await getBusinessTypeByOwnerId(CrmService.readerClient, ownerId);
  };
  public static getTagLeadByCompanyId = async (uuidCompany: string, ownerId: number): Promise<ITagNameByCompany[]> => {
    const tagOwnerIdList = await getTagLeadByCompanyId(CrmService.readerClient, uuidCompany, ownerId);
    const tagOwnerObject = await getTagLeadByOwner(CrmService.readerClient, ownerId);
    const tagIdList = tagOwnerObject.map((TagOwnerId) => TagOwnerId.tagownerid);
    const tagname = [];
    tagOwnerIdList.forEach((tag) => {
      const index = tagIdList.indexOf(tag.tagownerid);
      tagname.push({ tagname: tagOwnerObject[index].tagname });
    });
    return tagname;
  };
  public static getTagLeadByOwner = async (ownerId: number): Promise<ITagLead[]> => {
    return await getTagLeadByOwner(CrmService.readerClient, ownerId);
  };
  public static getNoteLeadByCompanyId = async (uuidCompany: string, ownerId: number): Promise<INoteLead[]> => {
    return await getNoteLeadByCompanyId(CrmService.readerClient, uuidCompany, ownerId);
  };
  public static multipleUpload = async (upLoadFiles: IGQLFileSteam[], uuidCompany: IUUIDCompany, ownerId: number, production: boolean): Promise<IHTTPResult> => {
    const uuidCompanyqueries = PostgresHelper.joinInQueries([uuidCompany.uuidCompany]);
    const companyId = await getCompanyIdByUUIDCompany(CrmService.readerClient, uuidCompanyqueries, ownerId);
    const { createReadStream, mimetype, filename } = await upLoadFiles[0].file;
    return new Promise((resolve) => {
      if (companyId !== undefined) {
        const imageStream = createReadStream();
        const bufs = [];
        imageStream.on('data', (chunks) => {
          bufs.push(chunks);
        });
        imageStream.on('end', async () => {
          const httpResult = { status: 500, value: '' } as IHTTPResult;
          const buf = Buffer.concat(bufs);
          const time = new Date();
          let newFileName = `staging/${uuidCompany.uuidCompany}/${companyId[0].companyid}_${time.getTime()}_${filename.replace(/\s/g, '_')}`;
          if (production) {
            newFileName = `production/${uuidCompany.uuidCompany}/${companyId[0].companyid}_${time.getTime()}_${filename.replace(/\s/g, '_')}`;
          }
          const resultSetFile = await setFileToS3Bucket(CrmService.s3Bucket, 'linestorage-staging', newFileName, buf, { ownerId: ownerId, userId: 1 });
          if (resultSetFile) {
            const resultUrl = await getS3FileFromBucket(CrmService.s3Bucket, 'linestorage-staging', newFileName);
            httpResult.status = 200;
            httpResult.value = resultUrl;
          }
          resolve(httpResult);
        });
      }
    });
  };
}
