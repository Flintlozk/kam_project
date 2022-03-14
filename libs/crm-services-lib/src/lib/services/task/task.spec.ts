import * as data from '../../data/task/task.data';
import * as googledata from '../../data/googlecalendar/googlecalendar.data';
import * as leaddata from '../../data/lead/lead.data';
import * as filedata from '../../data/files/files.data';
import * as domains from '../../domains';
import { mock } from '../../test/mock';
import { TaskService } from './task.service';
import {
  IAttachment,
  ICalendarDetail,
  IGoogleCalendar,
  IGoogleCalendarResponse,
  IGoogleCredential,
  IUploadFileResponse,
  IUuidAttachment,
  ResponseValue,
} from '@reactor-room/crm-models-lib';
import * as files from '../../data/files/files.data';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
jest.mock('../../domains');
describe('task', () => {
  const mockUuidAttachment: IUuidAttachment = {
    uuidAttachment: 'test',
  };

  const mockMetaData = { ownerid: 1, userid: 1 };
  const mockWrongMetaData = { ownerid: 2, userid: 2 };
  const mockGoogleRessult: IGoogleCalendar = {
    calendarId: '',
    htmlLink: '',
  };
  const mockReturnGetTask = [
    {
      title: 'Card Title1',
      team: 'Sale',
      dueDate: new Date(),
      uuidTask: 'f3b71eca-c5f1-4512-ab7a-17f4f61d1714',
      uuidCompany: '068c10e5-a03b-48c0-a2d0-e06d514cb06c',
      priority: '1',
      statusType: 'Open',
      uuidState: '0459a0fa-73be-4ba3-b833-4f015ac5400f',
      color: '#E3EDF2',
    },
    {
      title: 'Card Title2',
      team: 'Sale',
      dueDate: new Date(),
      uuidTask: '037f7834-f52d-4c3e-a3c8-0a82b375dc0c',
      uuidCompany: '068c10e5-a03b-48c0-a2d0-e06d514cb06c',
      priority: '1',
      statusType: 'Open',
      uuidState: '0459a0fa-73be-4ba3-b833-4f015ac5400f',
      color: '#E3EDF2',
    },
  ];
  const mockCompanyAddressDetail = [
    {
      uuidCompany: '068c10e5-a03b-48c0-a2d0-e06d514cb06c',
      companyname: 'John-Construction Co., Ltd.',
      note: 'none',
      district: 'none',
      address: 'none',
      postalcode: 'none',
      province: 'none',
      city: 'none',
      companyid: '2',
      businesstype: 'Construction businesses',
      ownerid: '1',
    },
  ];

  const mockInsertTaskDealInput = {
    uuidTask: 'e115f0a0-1315-433e-a45e-317db46475c6',
    dealvalue: 500,
    dealtitle: 'string',
    startDate: new Date(),
    endDate: new Date(),
  };
  const mockInsertTaskCross = {
    title: 'string',
    team: 'Sale',
    uuidState: '0459a0fa-73be-4ba3-b833-4f015ac5400f',
    uuidCompany: '068c10e5-a03b-48c0-a2d0-e06d514cb06c',
    dueDate: new Date(),
    parentTaskUUID: 'e115f0a0-1315-433e-a45e-317db46475c6',
    assignee: ['kosol', 'tonman'],
  };
  const mockCountCardDetail = [
    { count: '0', counttable: 'appointment' },
    { count: '0', counttable: 'note' },
  ];
  const mockDetailTaskData = {
    title: 'Card Title',
    team: 'Sale',
    statusType: 'Close',
    dueDate: new Date(),
    uuidTask: 'e115f0a0-1315-433e-a45e-317db46475c6',
    uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
    createDate: new Date(),
    createby: null,
    lastupdate: null,
    taskid: '24',
    companyid: '2',
    stateid: '3',
    ownerid: '1',
    uuidCompany: '068c10e5-a03b-48c0-a2d0-e06d514cb06c',
    companyname: 'John-Construction Co., Ltd.',
    note: 'none',
    district: 'none',
    address: 'none',
    postalcode: 'none',
    province: 'none',
    city: 'none',
    businesstype: 'Construction businesses',
  };
  const mockNoteId = {
    noteId: 1,
    flowId: 2,
  };
  const mockWrongNoteId = {
    noteId: 1,
    flowId: 3,
  };
  const mockAppointmentTask = [
    {
      appointmentid: '13',
      note: 'Note',
      appointmentDate: '2021-03-23 11:55:43',
      taskId: '21',
      uuidTask: null,
      uuidappointmenttask: 'bbc36927-9b42-4632-b6cf-9e775abc9a5c',
      uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
      appointmenttime: null,
      ownerid: '1',
    },
  ];
  const mockCreadentail: IGoogleCredential = {
    id_token:
      // eslint-disable-next-line max-len
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzZThkNDVhNDNjYjIyNDIxNTRjN2Y0ZGFmYWMyOTMzZmVhMjAzNzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTcxNDQwNTQ4NDA4LTdodjlocDlncDRhbXNxcWNpMTdubDUzb251ZmtncmFkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTcxNDQwNTQ4NDA4LTdodjlocDlncDRhbXNxcWNpMTdubDUzb251ZmtncmFkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0Nzk3NDkxNzM3NTUzMDI1MTE1IiwiaGQiOiJ0aGVpY29ud2ViLmNvbSIsImVtYWlsIjoia2FuaW5jaGFyb2VuQHRoZWljb253ZWIuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJUbnRyX3huMnVEa0VobHVjdkMyZkVnIiwibmFtZSI6IkthbmluIENoYXJvZW5yYXNzYW1lZWtpYXQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1id193bDMta29oYy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BTVp1dWNtMDBHWXM5dXRNeExBRVQ4dmxJMERkVy1zTXpBL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJLYW5pbiIsImZhbWlseV9uYW1lIjoiQ2hhcm9lbnJhc3NhbWVla2lhdCIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNjE3MDEyMDg2LCJleHAiOjE2MTcwMTU2ODYsImp0aSI6ImNjYWRkODMyYWZkZGIxY2I3MTBhMGU1NWEwZTFkNGY3ZjljOWQ4OTgifQ.ZN4rnoI7zP21hSJSKBU-qXafIy6z6ufR6eNr2pAlI65aXe6Tl-lnDnqw4iHKd--ZMbp541iFJg21Cnj1hB3DaFwHzoAIv3Pkpcg1M-F6hCT2xrWgyf_2Pz8eB-SfKEwA65zngJC1fFtHJoRxPGS4duUD_iLOyQIlp9SbyydfayN5rv6j6LFypbdSKqem0pM_Enla_yqJvUKUwUAvXDwxr--JCmikJpqRlHugeQ119OpkQvKYNEM8mwu5XzqoEzONQJPZlvTrPN2oqc6U2V7LhXpA93_mfp7iKIywxMj3c3ltJJfHum2qZumaW_Hfo_8RY1e_V2xxUlPQ3lhJM23onA',
    accessToken: '',
    expiresAt: '',
    ID: '',
    name: '',
    email: '',
    route: 'backend',
    profileImg: '',
  };
  const mockNoteDataByTaskId = [
    {
      noteDetail: 'bbbb',
      favourite: false,
      createBy: 'Kanintest',
      createDate: new Date(),
      lastUpdate: new Date(),
    },
  ];
  const mockTileAndTask = {
    title: 'string',
    uuidTask: 'e115f0a0-1315-433e-a45e-317db46475c6',
  };
  const mockgetUserAssign = [
    {
      name: 'Kaningmail',
      email: 'Kanin.charoen@gmail.com',
      pictureUrl: 'https://lh5.googleusercontent.com/-bw_wl3-kohc/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucm00GYs9utMxLAET8vlI0DdW-sMzA/s96-c/photo.jpg',
    },
  ];
  const mockContactTaskDetail = [
    {
      name: 'john mayer',
      email: 'john.mayer@gmail.com',
      phoneNumber: '089 999 9999',
    },
    { name: 'kosol', email: 'kosol', phoneNumber: 'kosol' },
  ];
  const mockTagData = [
    {
      tagname: 'TagTask',
      color: '#4FAEFA',
      taskid: '24',
      uuidTask: 'e115f0a0-1315-433e-a45e-317db46475c6',
      uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
      ownerid: '1',
    },
  ];
  const mockMemberFlow = [
    {
      uuiduser: '35b33d3d-db29-4d90-b940-571276537939',
      username: 'Kanincha',
      email: 'kanincharoen@theiconweb.com',
      ownerid: '1',
      uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
      active: true,
      profilePic: 'https://lh5.googleusercontent.com/-bw_wl3-kohc/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucm00GYs9utMxLAET8vlI0DdW-sMzA/s96-c/photo.jpg',
      userid: '3',
      userroleid: '2',
      flowid: '3',
      roleid: '1',
      rolename: 'ADMIN',
      uuidrole: 'ca790c2a-d569-45c6-beb3-fd299e4d240e',
    },
  ];

  const mockPathFileData = 'a745afdb-6c68-47c7-85fe-54bf9737eed2';
  const mockuuidCompany = '068c10e5-a03b-48c0-a2d0-e06d514cb06c';

  const mockuuidTask = 'a745afdb-6c68-47c7-85fe-54bf9737eed2';
  const mockDeleteNote = {
    uuidNote: 'a745afdb-6c68-47c7-85fe-54bf9737eed2',
    flowId: 2,
  };
  const mockHttpResult = {
    status: 200,
    value: '',
  };
  const uploadFileResponse: IUploadFileResponse = {
    status: 200,
    values: {
      fileName: 'test',
      fileUrl: 'test',
      filePath: 'test',
    },
  };
  const mockattachfile: IAttachment = {
    attachementPath: 'test',
    attachmentName: 'test',
    attachmentLink: 'test',
    uuidAttachment: 'test',
  };
  const mockattachfileList: IAttachment[] = [
    {
      attachementPath: 'test',
      attachmentName: 'test',
      attachmentLink: 'test',
      uuidAttachment: 'test',
    },
    {
      attachementPath: 'test',
      attachmentName: 'test',
      attachmentLink: 'test',
      uuidAttachment: 'test',
    },
  ];
  const mockUpdateActiveTask = {
    activeTask: false,
    uuidTask: 'test',
  };
  const mockHttpResultList = [
    {
      status: 200,
      value: '',
    },
    {
      status: 200,
      value: '',
    },
    {
      status: 200,
      value: '',
    },
  ];
  const mocktaskDealDetail = [
    {
      uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
      taskId: '7',
      dealId: '7',
      ownerid: null,
      dealvalue: '1111',
      cost: null,
      revenue: null,
      startDate: new Date(),
      endDate: new Date(),
      dealtitle: 'dfdfsdf',
      uuiddeal: '599eae2c-68fe-4d54-a8cc-b3bfc943d30b',
      dealid: '7',
    },
  ];
  const url = 'https://localhost:4200';
  const mockOwnerId = 1;
  const mockTeam = 'Sale';
  const mockUpdateTaskById = { statusType: 'Qualify', uuidTask: 'a745afdb-6c68-47c7-85fe-54bf9737eed2', team: 'Sale', uuidState: '05a4e8f7-086a-4fea-b4c9-22df8981f8de' };
  const mockInsertTag = {
    tagName: 'testTagName',
    uuidTask: 'a745afdb-6c68-47c7-85fe-54bf9737eed2',
  };
  const mockInsertAppointment = {
    appointmentStartDate: new Date().toString(),
    appointmentEndDate: new Date().toString(),
    companyName: '',
    href: '',
    appointmentNote: 'string',
    uuidTask: 'a745afdb-6c68-47c7-85fe-54bf9737eed2',
  };
  const mockUuidAppointment = 'a745afdb-6c68-47c7-85fe-54bf9737eed2';
  const mockUuidAppointmentList = [{ uuidAppointment: 'a745afdb-6c68-47c7-85fe-54bf9737eed2' }];
  const mockEditAppointment = {
    appointmentStartDate: new Date().toString(),
    appointmentEndDate: new Date().toString(),
    companyName: '',
    href: '',
    appointmentNote: 'string',
    uuidTask: 'a745afdb-6c68-47c7-85fe-54bf9737eed2',
    uuidAppointment: 'a745afdb-6c68-47c7-85fe-54bf9737eed2',
  };
  const mockInsertTaskAssign = {
    value: 'string',
    uuidTask: 'a745afdb-6c68-47c7-85fe-54bf9737eed2',
    taskId: 1,
  };
  const mockUserId = 1;
  const mockTaskAssign = [
    {
      userid: '1',
      taskid: '10',
      uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
      ownerid: '1',
      uuiduser: '8a552159-f366-4475-95ba-5448b263db64',
      username: 'kosol',
      email: 'kosol@theiconweb.com',
      active: true,
      profilePic: 'https://lh6.googleusercontent.com/-76MzH8yg_io/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclgk_LPOaTR6DaiHdWeKMFmCaDHBA/s96-c/photo.jpg',
    },
  ];
  const mockInsertNoteTask = {
    uuidTask: 'a745afdb-6c68-47c7-85fe-54bf9737eed2',
    noteDetail: 'Note detailll',
    isInternalNote: true,
    flowId: 2,
  };
  const mockUpdateNoteTask = {
    noteDetail: 'Note detailll',
    uuidNote: 'test',
    flowId: 2,
  };
  const mockfiles = [
    {
      filename: 'test.txt',
      mimetype: 'text/plain',
      encoding: 'base64',
    },
    {
      filename: 'test.txt',
      mimetype: 'text/plain',
      encoding: 'base64',
    },
    {
      filename: 'test.txt',
      mimetype: 'text/plain',
      encoding: 'base64',
    },
  ];
  const mocktaskCreateConditions = [];
  const mockClientId = '971440548408-7hv9hp9gp4amsqqci17nl53onufkgrad.apps.googleusercontent.com';
  const mockClientSecret = 'A_EI0xJ6jNb9GOwpFMC-fWSS';
  const mockCalendarDetail: ICalendarDetail = { description: 'test', calendarId: 'test', href: 'test' };
  const mockGoogleCalendarResponse: IGoogleCalendarResponse = { noteDetail: 'test', startDate: 'test', endDate: 'test' };
  test('get all task fileter by team', async () => {
    mock(data, 'getTaskByFlow', jest.fn().mockResolvedValue(mockReturnGetTask));
    const result = await TaskService.getTaskByFlow(mockTeam, mockOwnerId, mockUserId);
    expect(data.getTaskByFlow).toHaveBeenCalled();
    expect(result).toBe(mockReturnGetTask);
  });
  test('updateTaskById', async () => {
    mock(data, 'updateTaskById', jest.fn().mockResolvedValue(mockHttpResult));
    mock(domains, 'getDeleteAutoCreateTask', jest.fn().mockResolvedValue(false));
    const result = await TaskService.updateTaskById(mockUpdateTaskById, mockOwnerId, mocktaskCreateConditions, mockUserId);
    expect(data.updateTaskById).toHaveBeenCalled();
    expect(domains.getDeleteAutoCreateTask).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });

  test('insertTagById', async () => {
    mock(data, 'insertTagById', jest.fn().mockResolvedValue(mockHttpResult));
    const result = await TaskService.insertTagById(mockInsertTag, mockOwnerId);
    expect(data.insertTagById).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });

  test('insertAppointmentTask', async () => {
    mock(data, 'insertAppointmentTask', jest.fn().mockResolvedValue(mockHttpResult));
    mock(googledata, 'insertCalendarInGoogleCalendar', jest.fn().mockResolvedValue(mockGoogleRessult));
    const result = await TaskService.insertAppointmentTask(mockInsertAppointment, mockOwnerId, 1, mockCreadentail, url, mockClientId, mockClientSecret);
    expect(data.insertAppointmentTask).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });
  test('editAppointmentTask', async () => {
    mock(data, 'getCalendarDetailByAppointmentUuid', jest.fn().mockResolvedValue(mockCalendarDetail));
    mock(data, 'editAppointmentTask', jest.fn().mockResolvedValue(mockHttpResult));
    mock(googledata, 'editCalendarInGoogleCalendar', jest.fn().mockResolvedValue({}));
    const result = await TaskService.editAppointmentTask(mockEditAppointment, mockOwnerId, 1, mockCreadentail, url, mockClientId, mockClientSecret);
    expect(data.getCalendarDetailByAppointmentUuid).toHaveBeenCalled();
    expect(data.editAppointmentTask).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });
  test('deleteAppointmentTask', async () => {
    mock(data, 'getCalendarDetailByAppointmentUuid', jest.fn().mockResolvedValue(mockCalendarDetail));
    mock(data, 'deleteAppointmentTask', jest.fn().mockResolvedValue(mockHttpResult));
    mock(googledata, 'deleteCalendarInGoogleCalendar', jest.fn().mockResolvedValue({}));
    const result = await TaskService.deleteAppointmentTask(mockUuidAppointment, mockOwnerId, mockCreadentail, mockClientId, mockClientSecret);
    expect(data.getCalendarDetailByAppointmentUuid).toHaveBeenCalled();
    expect(data.deleteAppointmentTask).toHaveBeenCalled();
    expect(googledata.deleteCalendarInGoogleCalendar).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });

  test('getTaskDetailById', async () => {
    mock(data, 'getTaskDetailById', jest.fn().mockResolvedValue(mockDetailTaskData));
    const result = await TaskService.getTaskDetailById(mockPathFileData, mockOwnerId);
    expect(data.getTaskDetailById).toHaveBeenCalled();
    expect(result).toBe(mockDetailTaskData);
  });

  test('getNoteByTask', async () => {
    mock(data, 'getNoteByTask', jest.fn().mockResolvedValue(mockNoteDataByTaskId));
    const result = await TaskService.getNoteByTask(mockuuidTask, mockOwnerId);
    expect(data.getNoteByTask).toHaveBeenCalled();
    expect(result).toBe(mockNoteDataByTaskId);
  });

  test('getTagByTask', async () => {
    mock(data, 'getTagByTask', jest.fn().mockResolvedValue(mockTagData));
    const result = await TaskService.getTagTask(mockuuidTask, mockOwnerId);
    expect(data.getTagByTask).toHaveBeenCalled();
    expect(result).toBe(mockTagData);
  });
  test('insertAssignTask', async () => {
    mock(data, 'insertAssigneByTask', jest.fn().mockResolvedValue(mockHttpResult));
    const result = await TaskService.insertAssignTask(mockInsertTaskAssign, mockOwnerId);
    expect(data.insertAssigneByTask).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });
  test('getTaskAssignByTeam', async () => {
    mock(data, 'getTaskAssignByTeam', jest.fn().mockResolvedValue(mockTaskAssign));
    const result = await TaskService.getTaskAssignByTeam(mockuuidTask, mockOwnerId);
    expect(data.getTaskAssignByTeam).toHaveBeenCalled();
    expect(result).toBe(mockTaskAssign);
  });

  test('insertNoteTask', async () => {
    mock(data, 'insertNoteTask', jest.fn().mockResolvedValue(mockHttpResult));
    mock(files, 'uploadFileToMinio', jest.fn().mockResolvedValue(uploadFileResponse));
    mock(data, 'insertAttachementByNoteId', jest.fn().mockResolvedValue('test'));
    const result = await TaskService.insertNoteTask(mockInsertNoteTask, mockOwnerId, mockUserId, mockfiles, false, 'crmstorage-staging');
    expect(data.insertNoteTask).toHaveBeenCalled();
    expect(files.uploadFileToMinio).toBeCalledTimes(3);
    expect(result[0].value).toBe('test test');
    expect(result[1].value).toBe('test test');
    expect(result[2].value).toBe('test test');
  });

  test('getContactTask', async () => {
    mock(data, 'getContactTask', jest.fn().mockResolvedValue(mockContactTaskDetail));
    const result = await TaskService.getContactTask(mockuuidCompany, mockOwnerId);
    expect(data.getContactTask).toHaveBeenCalled();
    expect(result).toBe(mockContactTaskDetail);
  });

  test('getAppointmentTask', async () => {
    mock(data, 'getUuidAppointmentByTask', jest.fn().mockResolvedValue(mockUuidAppointmentList));
    mock(data, 'getAppointmentTask', jest.fn().mockResolvedValue(mockAppointmentTask));
    mock(data, 'getCalendarDetailByAppointmentUuid', jest.fn().mockResolvedValue(mockCalendarDetail));
    mock(googledata, 'getCalendarInGoogleCalendar', jest.fn().mockResolvedValue(mockGoogleCalendarResponse));
    mock(data, 'updateAppointmentTaskFromGoogleCalendar', jest.fn().mockResolvedValue({}));
    const result = await TaskService.getAppointmentTask(mockuuidTask, mockOwnerId, mockCreadentail, url, mockClientId, mockClientSecret);
    expect(data.getUuidAppointmentByTask).toHaveBeenCalled();
    expect(data.getCalendarDetailByAppointmentUuid).toHaveBeenCalled();
    expect(googledata.getCalendarInGoogleCalendar).toHaveBeenCalled();
    expect(data.updateAppointmentTaskFromGoogleCalendar).toHaveBeenCalled();
    expect(data.getAppointmentTask).toHaveBeenCalled();
    expect(result).toBe(mockAppointmentTask);
  });

  test(' getTaskDealListByTaskService', async () => {
    mock(data, 'getTaskDealListByTask', jest.fn().mockResolvedValue(mocktaskDealDetail));
    const result = await TaskService.getTaskDealListByTask(mockuuidTask, mockOwnerId);
    expect(data.getTaskDealListByTask).toHaveBeenCalled();
    expect(result).toBe(mocktaskDealDetail);
  });

  test('insertTaskDealByTaskService', async () => {
    mock(data, 'insertTaskDealByTask', jest.fn().mockResolvedValue(mockHttpResult));
    const result = await TaskService.insertTaskDealByTask(mockInsertTaskDealInput, mockOwnerId);
    expect(data.insertTaskDealByTask).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });

  test('insertTaskCrossTeamService', async () => {
    mock(data, 'getChildTaskByparentId', jest.fn().mockResolvedValue(null));
    mock(data, 'insertTaskCrossTeam', jest.fn().mockResolvedValue(mockHttpResult));
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({}));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));
    mock(data, 'insertAssigneeCrossTeam', jest.fn().mockResolvedValue({}));
    const result = await TaskService.insertTaskCrossTeam(mockInsertTaskCross, mockOwnerId);
    expect(data.insertTaskCrossTeam).toHaveBeenCalled();
    expect(data.insertAssigneeCrossTeam).toHaveBeenCalledTimes(2);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalled();
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalled();
    expect(result).toStrictEqual(mockHttpResult);
  });

  test('getUserAssignService', async () => {
    mock(data, 'getAllUser', jest.fn().mockResolvedValue(mockgetUserAssign));
    const result = await TaskService.getAllUser(mockOwnerId);
    expect(data.getAllUser).toHaveBeenCalled();
    expect(result).toBe(mockgetUserAssign);
  });

  test('getCompanyAddressService', async () => {
    mock(data, 'getCompanyAddress', jest.fn().mockResolvedValue(mockCompanyAddressDetail));
    const result = await TaskService.getCompanyAddress(mockPathFileData, mockOwnerId);
    expect(data.getCompanyAddress).toHaveBeenCalled();
    expect(result).toBe(mockCompanyAddressDetail);
  });

  test('updateTaskTitle', async () => {
    mock(data, 'updateTaskTitle', jest.fn().mockResolvedValue(mockHttpResult));
    const result = await TaskService.updateTaskTitle(mockTileAndTask, mockOwnerId);
    expect(data.updateTaskTitle).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });

  test('getMemberFlowService', async () => {
    mock(data, 'getMemberFlow', jest.fn().mockResolvedValue(mockMemberFlow));
    const result = await TaskService.getMemberFlow('Open', mockOwnerId);
    expect(data.getMemberFlow).toHaveBeenCalled();
    expect(result).toBe(mockMemberFlow);
  });

  test('getCountDetailService', async () => {
    mock(data, 'getCountDetail', jest.fn().mockResolvedValue(mockCountCardDetail));
    const result = await TaskService.getCountDetail(mockuuidTask, mockOwnerId);
    expect(data.getCountDetail).toHaveBeenCalled();
    expect(result).toBe(mockCountCardDetail);
  });
  test('updateActiveTask', async () => {
    mock(leaddata, 'changeStatusActiveLeadByCompanyId', jest.fn().mockResolvedValue({}));
    mock(data, 'updateActiveTask', jest.fn().mockResolvedValue(mockHttpResult));
    const result = await TaskService.updateActiveTask(mockUpdateActiveTask, mockOwnerId);
    expect(data.updateActiveTask).toHaveBeenCalled();
    expect(leaddata.changeStatusActiveLeadByCompanyId).toHaveBeenCalled();
    expect(result).toBe(mockHttpResult);
  });
  test('deleteAttachment', async () => {
    mock(data, 'getAttachmentByUuidAttachemnt', jest.fn().mockResolvedValue(mockattachfile));
    mock(filedata, 'getMetaDataFromObject', jest.fn().mockResolvedValue(mockMetaData));
    mock(filedata, 'deleteFileOfS3Bucket', jest.fn().mockResolvedValue({}));
    mock(data, 'deleteAttachment', jest.fn().mockResolvedValue({}));
    const result = await TaskService.deleteAttachment(mockUuidAttachment, mockOwnerId, mockUserId);
    expect(data.deleteAttachment).toHaveBeenCalled();
    expect(data.getAttachmentByUuidAttachemnt).toHaveBeenCalled();
    expect(filedata.getMetaDataFromObject).toHaveBeenCalled();
    expect(result).toStrictEqual(mockHttpResult);
  });
  test('deleteAttachment', async () => {
    mock(data, 'getAttachmentByUuidAttachemnt', jest.fn().mockResolvedValue(mockattachfile));
    mock(filedata, 'getMetaDataFromObject', jest.fn().mockResolvedValue(mockWrongMetaData));
    await expect(TaskService.deleteAttachment(mockUuidAttachment, mockOwnerId, mockUserId)).rejects.toThrow(ResponseValue.CANNOT_DELETE_ATTACHMENT);
    expect(data.deleteAttachment).toHaveBeenCalled();
    expect(data.getAttachmentByUuidAttachemnt).toHaveBeenCalled();
    expect(filedata.getMetaDataFromObject).toHaveBeenCalled();
  });
  test('updateNoteTask', async () => {
    mock(data, 'getflowIdFromUuidNote', jest.fn().mockResolvedValue({ flowId: 2 }));
    mock(data, 'updateNoteTask', jest.fn().mockResolvedValue(mockHttpResult));
    const result = await TaskService.updateNoteTask(mockUpdateNoteTask, mockOwnerId);
    expect(data.getflowIdFromUuidNote).toHaveBeenCalled();
    expect(data.updateNoteTask).toHaveBeenCalled();
    expect(result).toStrictEqual(mockHttpResult);
  });
  test('deleteNoteTask', async () => {
    mock(data, 'getNoteIdByUuidNote', jest.fn().mockResolvedValue(mockNoteId));
    mock(data, 'getAttachmentByNoteId', jest.fn().mockResolvedValue(mockattachfileList));
    mock(filedata, 'getMetaDataFromObject', jest.fn().mockResolvedValue(mockMetaData));
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({}));
    mock(filedata, 'deleteFileOfS3Bucket', jest.fn().mockResolvedValue({}));
    mock(data, 'deleteAttachmentByNoteId', jest.fn().mockResolvedValue({}));
    mock(data, 'deleteNoteTaskByNoteId', jest.fn().mockResolvedValue({}));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));
    const result = await TaskService.deleteNoteTask(mockDeleteNote, mockOwnerId, mockUserId);
    expect(data.getNoteIdByUuidNote).toHaveBeenCalled();
    expect(data.getAttachmentByNoteId).toHaveBeenCalled();
    expect(filedata.getMetaDataFromObject).toHaveBeenCalled();
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalled();
    expect(filedata.deleteFileOfS3Bucket).toHaveBeenCalled();
    expect(data.deleteAttachmentByNoteId).toHaveBeenCalled();
    expect(data.deleteNoteTaskByNoteId).toHaveBeenCalled();
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalled();
    expect(result).toStrictEqual(mockHttpResult);
  });
  test('deleteNoteTask cannot delete sharing note', async () => {
    mock(data, 'getNoteIdByUuidNote', jest.fn().mockResolvedValue(mockWrongNoteId));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));
    await expect(TaskService.deleteNoteTask(mockDeleteNote, mockOwnerId, mockUserId)).rejects.toThrow(ResponseValue.CANNOT_DELETE_SHARING_NOTE);
    expect(data.getNoteIdByUuidNote).toHaveBeenCalled();
  });
});
