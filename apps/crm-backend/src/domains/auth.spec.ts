import { mock } from '../../src/test/mock';
import * as domain from './auth.domain';
import { EnumAuthScope, IStateCreateCondition } from '@reactor-room/crm-models-lib';
import * as data from 'libs/crm-services-lib/src/lib/data/task/task.data';
import * as redis from 'libs/crm-services-lib/src/lib/data/redis';
import * as verify from './auth-verify.domain';
import * as helper from '@reactor-room/itopplus-back-end-helpers';
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('libs/crm-services-lib/src/lib/data/redis');

describe('auth', () => {
  const mockVerifyTokenResult = [
    {
      value: {
        uuiduser: '35b33d3d-db29-4d90-b940-571276537939',
        username: 'Kanincha',
        email: '0c3a2f63518c3044de337d5788a0bed79eb0f664f017f4ed880ac75e79b854a9',
        uuidowner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
        ownerId: '1',
        userId: '3',
        is_admin: true,
        iat: 1618825496,
      },
      status: 200,
    },
  ];
  const mockTokenRemoveBearer =
    // eslint-disable-next-line max-len
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkdXNlciI6IjM1YjMzZDNkLWRiMjktNGQ5MC1iOTQwLTU3MTI3NjUzNzkzOSIsInVzZXJuYW1lIjoiS2FuaW5jaGEiLCJlbWFpbCI6IjBjM2EyZjYzNTE4YzMwNDRkZTMzN2Q1Nzg4YTBiZWQ3OWViMGY2NjRmMDE3ZjRlZDg4MGFjNzVlNzliODU0YTkiLCJ1dWlkb3duZXIiOiI5OTg3ZjExZC1iMzUwLTRlNDUtOTczYS1mNWJhOTcxM2ZlOGEiLCJvd25lcklkIjoiMSIsInVzZXJJZCI6IjMiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNjE4ODI1NDk2fQ.fJyNCDQiXKFBqpzdcA3QwaXf60uHt76tBF-iQSF-J90';
  const mockResultFromRedis = [
    {
      userLoginData: {
        uuiduser: '35b33d3d-db29-4d90-b940-571276537939',
        username: 'Kanincha',
        email: '0c3a2f63518c3044de337d5788a0bed79eb0f664f017f4ed880ac75e79b854a9',
        uuidowner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
        ownerId: '1',
        userId: '3',
        is_admin: true,
      },
      userPermission: [
        {
          allow_to_imported: true,
          allow_to_create_deal: true,
          allow_to_create_task: true,
        },
      ],
      taskCreateCondition: [
        {
          uuidState: '04caee7b-b061-480d-9571-9b2a3bdb8e41',
          stateId: '8',
          actionType: 'REQUIRED',
          assignee: 1,
          deal: null,
          key: 'assignee',
          value: 1,
        },
        {
          uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933',
          stateId: '3',
          actionType: 'APPROVE',
          assignee: null,
          deal: null,
          key: 'approval',
          value: [Array],
        },
        {
          uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
          stateId: '4',
          actionType: 'REQUIRED',
          assignee: 2,
          deal: 1,
          key: 'assignee',
          value: 2,
        },
        {
          uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
          stateId: '4',
          actionType: 'REQUIRED',
          assignee: 2,
          deal: 1,
          key: 'deal',
          value: 1,
        },
      ],
    },
  ];
  const mockResultValueGetRedis = [
    {
      userLoginData: {
        uuiduser: '35b33d3d-db29-4d90-b940-571276537939',
        username: 'Kanincha',
        email: '0c3a2f63518c3044de337d5788a0bed79eb0f664f017f4ed880ac75e79b854a9',
        uuidowner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
        ownerId: '1',
        userId: '3',
        is_admin: true,
      },
      userPermission: [
        {
          allow_to_imported: true,
          allow_to_create_deal: true,
          allow_to_create_task: true,
        },
      ],
      taskCreateCondition: [
        {
          uuidState: '04caee7b-b061-480d-9571-9b2a3bdb8e41',
          stateId: '8',
          actionType: 'REQUIRED',
          assignee: 1,
          deal: null,
          key: 'assignee',
          value: 1,
        },
        {
          uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933',
          stateId: '3',
          actionType: 'APPROVE',
          assignee: null,
          deal: null,
          key: 'approval',
          value: [Array],
        },
        {
          uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
          stateId: '4',
          actionType: 'REQUIRED',
          assignee: 2,
          deal: 1,
          key: 'assignee',
          value: 2,
        },
        {
          uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
          stateId: '4',
          actionType: 'REQUIRED',
          assignee: 2,
          deal: 1,
          key: 'deal',
          value: 1,
        },
      ],
    },
  ];
  const mockPayloadLogin = [
    {
      userLoginData: {
        uuiduser: '35b33d3d-db29-4d90-b940-571276537939',
        username: 'Kanincha',
        email: '0c3a2f63518c3044de337d5788a0bed79eb0f664f017f4ed880ac75e79b854a9',
        uuidowner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
        ownerId: '1',
        userId: '3',
        is_admin: true,
      },
      userPermission: [
        {
          allow_to_imported: true,
          allow_to_create_deal: true,
          allow_to_create_task: true,
        },
      ],
      taskCreateCondition: [
        {
          uuidState: '04caee7b-b061-480d-9571-9b2a3bdb8e41',
          stateId: '8',
          actionType: 'REQUIRED',
          assignee: 1,
          deal: null,
          key: 'assignee',
          value: 1,
        },
        {
          uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933',
          stateId: '3',
          actionType: 'APPROVE',
          assignee: null,
          deal: null,
          key: 'approval',
          value: ['Kanin', 'Kosol'],
        },
        {
          uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
          stateId: '4',
          actionType: 'REQUIRED',
          assignee: 2,
          deal: 1,
          key: 'assignee',
          value: 2,
        },
        {
          uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
          stateId: '4',
          actionType: 'REQUIRED',
          assignee: 2,
          deal: 1,
          key: 'deal',
          value: 1,
        },
      ],
    },
  ];
  const mockCreateTaskUserInput = {
    uuidTask: 'd79e2cde-424d-46c5-a5e2-4888b93ddbb2',
    previousStatusType: '05a4e8f7-086a-4fea-b4c9-22df8981f8de',
    uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933',
    team: '2',
    updateCross: false,
  };
  const mockCreateTaskConditionMultiple: IStateCreateCondition[] = [
    {
      uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933',
      stateId: 3,
      actionType: 'REQUIRED',
      assignee: 1,
      deal: null,
      key: 'assignee',
      value: '1',
      stateType: 'NORMAL',
    },
    {
      uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933',
      stateId: 3,
      actionType: 'REQUIRED',
      assignee: 1,
      deal: null,
      key: 'deal',
      value: '1',
      stateType: 'NORMAL',
    },
    {
      uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933',
      stateId: 3,
      actionType: 'APPROVE',
      assignee: null,
      deal: null,
      key: 'approval',
      value: ['kanin', 'kosol'],
      stateType: 'NORMAL',
    },
  ];
  const mockCreateTaskCondition: IStateCreateCondition[] = [
    {
      uuidState: '04caee7b-b061-480d-9571-9b2a3bdb8e41',
      stateId: 8,
      actionType: 'REQUIRED',
      assignee: 1,
      deal: null,
      key: 'assignee',
      value: '1',
      stateType: 'NORMAL',
    },
    {
      uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933',
      stateId: 3,
      actionType: 'APPROVE',
      assignee: null,
      deal: null,
      key: 'approval',
      value: ['kanin', 'kosol'],
      stateType: 'NORMAL',
    },
    {
      uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
      stateId: 4,
      actionType: 'REQUIRED',
      assignee: 2,
      deal: '1',
      key: 'assignee',
      value: '2',
      stateType: 'NORMAL',
    },
    {
      uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
      stateId: 4,
      actionType: 'REQUIRED',
      assignee: 2,
      deal: '1',
      key: 'deal',
      value: '1',
      stateType: 'NORMAL',
    },
  ];
  const mockOwnerId = 1;
  const mockUserId = 1;
  const mockCreateTaskCountCondition = { assignee: 7, deal: 0 };
  const mockAuthScope: EnumAuthScope[] = [EnumAuthScope.ADMIN];
  const mockResultVerifyApproval = { type: 'APPROVE', value: true };
  const mockResultVerifyFalse = { type: 'APPROVE', value: false };
  const mockResultGetCondition = [
    {
      stateId: '2',
      uuidState: '3db15a1a-a58d-40e2-8f50-6988074901ba',
      stateName: 'Follow',
      team: 'AE',
      conditions: 'assign',
      newstate: 4,
    },
  ];
  const mockResultGetAllUser = [
    {
      name: 'tonman',
      profilePic: 'https://lh6.googleusercontent.com/-76MzH8yg_io/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclgk_LPOaTR6DaiHdWeKMFmCaDHBA/s96-c/photo.jpg',
    },
  ];
  test('test required login google', async () => {
    mock(helper, 'removeBearerText', jest.fn().mockResolvedValue(mockTokenRemoveBearer));
    mock(redis, 'getAccessTokenRedis', jest.fn().mockResolvedValue(mockResultFromRedis));
    const resultExtractPayload = await domain.verifyAndExtractPayload(mockTokenRemoveBearer);
    const resultVerifyAllowApplication = await domain.verifyAllowApplicationScope(mockAuthScope, true);
    expect(resultExtractPayload).toStrictEqual(mockResultValueGetRedis);
    expect(resultVerifyAllowApplication).toBe(true);
  });
  // test('test required login google with no data on Redis', async () => {
  //   mock(domain, 'verifyToken', jest.fn().mockResolvedValue(mockVerifyTokenResult));
  //   mock(domain, 'getAccessTokenRedis', jest.fn().mockResolvedValue(null));
  //   expect(domain.verifyAndExtractPayload('randomtoken')).toThrow();
  // });
  test('test verify Create Task false', async () => {
    mock(data, 'getCountVerifyTaskDetail', jest.fn().mockResolvedValue(mockCreateTaskCountCondition));
    mock(data, 'getConditionInsertCross', jest.fn().mockResolvedValue(mockResultGetCondition));
    mock(data, 'getAllUserInNewState', jest.fn().mockResolvedValue(mockResultGetAllUser));
    mock(data, 'getMoveToNextState', jest.fn().mockResolvedValue(false));
    mock(verify, 'verifyApproval', jest.fn().mockResolvedValue(mockResultVerifyFalse));
    const result = await domain.verifyCreateTask(mockCreateTaskUserInput, mockCreateTaskCondition, mockOwnerId, mockUserId);
    const resultCreateTask = await result.value;
    expect(resultCreateTask.value).toBe(false);
    expect(verify.verifyApproval).toHaveBeenCalled();
  });
  test('test verify Create Task with multi Condition', async () => {
    mock(data, 'getCountVerifyTaskDetail', jest.fn().mockResolvedValue(mockCreateTaskCountCondition));
    mock(data, 'getConditionInsertCross', jest.fn().mockResolvedValue(mockResultGetCondition));
    mock(data, 'getAllUserInNewState', jest.fn().mockResolvedValue(mockResultGetAllUser));
    mock(data, 'getMoveToNextState', jest.fn().mockResolvedValue(false));
    mock(verify, 'verifyRequiredField', jest.fn().mockResolvedValue(mockResultVerifyApproval));
    mock(verify, 'verifyApproval', jest.fn().mockResolvedValue(mockResultVerifyApproval));
    const result = await domain.verifyCreateTask(mockCreateTaskUserInput, mockCreateTaskConditionMultiple, mockOwnerId, mockUserId);
    const resultCreateTask = await result.value;
    await expect(verify.verifyRequiredField).toHaveBeenCalledTimes(2);
    await expect(verify.verifyApproval).toHaveBeenCalledTimes(1);
    expect(resultCreateTask.value).toBe(true);
  });
});
