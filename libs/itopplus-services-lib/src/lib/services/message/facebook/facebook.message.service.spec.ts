import { EnumAllowedSendMessage } from '@reactor-room/itopplus-model-lib';
import * as audienceData from '../../../data/audience';
import * as commentData from '../../../data/comments/get-comments.data';
import * as messageData from '../../../data/message';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { mock } from '../../../test/mock';
import { FacebookMessageService } from './facebook.message.service';
import { PlusmarService } from '../../plusmarservice.class';
import { environmentLib } from '@reactor-room/environment-services-backend';

// jest.mock('@reactor-room/itopplus-back-end-helpers');

jest.mock('../../../data/audience');
jest.mock('../../../data/customer/customer.data');
jest.mock('../../../data/message');
jest.mock('../../../data/comments/get-comments.data');

describe('FacebookMessageService', () => {
  beforeEach(() => {
    mock(audienceData, 'getLastTwoOfAudienceByAudienceID', jest.fn().mockResolvedValue([{ audienceID: 999 }]));
  });
  test('checkMessageActivity | INBOX:ALLOW & COMMENT:PRIVATE_ONLY', async () => {
    const func = new FacebookMessageService();

    const mockAudienceMessage = [
      {
        _id: '601bb7e9c2d48ace6da84cc7',
        object: 'page',
        pageID: 91,
        audienceID: 3209,
        createdAt: '2099-02-04T09:01:24Z',
        mid: 'm_kPIaDPoGzM3sVdsm7EzTDTQDyucjCpgNmO_zwgSWqolbqSXlJnAUA6bCJ9SJHsaYsG4lNvAlU98Jb9S-r1yCUA',
        text: 'WEll',
        attachments: 'null',
        sentBy: 'AUDIENCE',
        payload: 'PAYLOAD',
        messagingType: null,
        __v: 0,
      },
    ];
    const mockAudienceComment = [
      {
        hidden: false,
        replies: [],
        _id: '601a5b960874ddc11cd957bb',
        text: 'sdadsad',
        pageID: 91,
        audienceID: 3209,
        postID: '5feafa5612e09ef399c587b8',
        commentID: '3585315378218061_3680133398736258',
        payload: 'PAYLOAD',
        attachment: '{"id":"3585315378218061_3680133398736258"}',
        sentBy: 'AUDIENCE',
        isReply: false,
        createdAt: '2071-02-03T08:15:10.000Z',
        __v: 0,
      },
    ];

    mock(messageData, 'getLastMessagesSentByIDs', jest.fn().mockResolvedValue(mockAudienceMessage));
    mock(commentData, 'getLastCommentSentByIDs', jest.fn().mockResolvedValueOnce(mockAudienceComment));

    const result = await func.checkMessageActivity(91, 999);
    expect(result).toEqual({
      inbox: { allowOn: EnumAllowedSendMessage.ALLOW, reason: 'ALLOW' },
      comment: { allowOn: EnumAllowedSendMessage.PRIVATE_ONLY, reason: 'PRIVATE_ONLY' },
    });

    expect(messageData.getLastMessagesSentByIDs).toBeCalled();
    expect(commentData.getLastCommentSentByIDs).toBeCalled();
  });
  test('checkMessageActivity | INBOX:ALLOW_TAG & COMMENT:NOT_ALLOW', async () => {
    const func = new FacebookMessageService();

    const mockAudienceMessage = [
      {
        _id: '601bb7e9c2d48ace6da84cc7',
        object: 'page',
        pageID: 91,
        audienceID: 3209,
        createdAt: '2021-01-02T09:01:24Z',
        mid: 'm_kPIaDPoGzM3sVdsm7EzTDTQDyucjCpgNmO_zwgSWqolbqSXlJnAUA6bCJ9SJHsaYsG4lNvAlU98Jb9S-r1yCUA',
        text: 'WEll',
        attachments: 'null',
        sentBy: 'AUDIENCE',
        payload: 'PAYLOAD',
        messagingType: null,
        __v: 0,
      },
      {
        _id: '601bb7e9c2d48ace6da84cc7',
        object: 'page',
        pageID: 91,
        audienceID: 3209,
        createdAt: '2021-02-04T09:01:24Z',
        mid: 'm_kPIaDPoGzM3sVdsm7EzTDTQDyucjCpgNmO_zwgSWqolbqSXlJnAUA6bCJ9SJHsaYsG4lNvAlU98Jb9S-r1yCUA',
        text: 'WEll',
        attachments: 'null',
        sentBy: 'PAGE',
        payload: 'PAYLOAD',
        messagingType: null,
        __v: 0,
      },
    ];
    const mockAudienceComment = [];

    // mock(helpers, 'getTimeRange', jest.fn().mockReturnValueOnce(1));
    mock(messageData, 'getLastMessagesSentByIDs', jest.fn().mockResolvedValue(mockAudienceMessage));
    mock(commentData, 'getLastCommentSentByIDs', jest.fn().mockResolvedValueOnce(mockAudienceComment));

    const result = await func.checkMessageActivity(99, 999);
    expect(result).toEqual({
      inbox: { allowOn: EnumAllowedSendMessage.ALLOW_TAG, reason: 'ALLOW_TAG' },
      comment: { allowOn: EnumAllowedSendMessage.NOT_ALLOW, reason: 'NOT_ALLOW' },
    });

    expect(messageData.getLastMessagesSentByIDs).toBeCalled();
    expect(commentData.getLastCommentSentByIDs).toBeCalled();
  });
  test('checkMessageActivity | INBOX:ALLOW & COMMENT:NOT_ALLOW', async () => {
    const func = new FacebookMessageService();

    const mockAudienceMessage = [
      {
        _id: '601bb7e9c2d48ace6da84cc7',
        object: 'page',
        pageID: 91,
        audienceID: 3209,
        createdAt: '2099-02-04T09:01:24Z',
        mid: 'm_kPIaDPoGzM3sVdsm7EzTDTQDyucjCpgNmO_zwgSWqolbqSXlJnAUA6bCJ9SJHsaYsG4lNvAlU98Jb9S-r1yCUA',
        text: 'WEll',
        attachments: 'null',
        sentBy: 'AUDIENCE',
        payload: 'PAYLOAD',
        messagingType: null,
        __v: 0,
      },
    ];
    const mockAudienceComment = [];

    mock(messageData, 'getLastMessagesSentByIDs', jest.fn().mockResolvedValue(mockAudienceMessage));
    mock(commentData, 'getLastCommentSentByIDs', jest.fn().mockResolvedValueOnce(mockAudienceComment));

    const result = await func.checkMessageActivity(99, 999);
    expect(result).toEqual({
      inbox: { allowOn: EnumAllowedSendMessage.ALLOW, reason: 'ALLOW' },
      comment: { allowOn: EnumAllowedSendMessage.NOT_ALLOW, reason: 'NOT_ALLOW' },
    });

    expect(messageData.getLastMessagesSentByIDs).toBeCalled();
    expect(commentData.getLastCommentSentByIDs).toBeCalled();
  });
  test('checkMessageActivity | INBOX:ALLOW_TAG & COMMENT:NOT_ALLOW', async () => {
    const func = new FacebookMessageService();

    const mockAudienceMessage = [];
    const mockAudienceComment = [];

    mock(messageData, 'getLastMessagesSentByIDs', jest.fn().mockResolvedValue(mockAudienceMessage));
    mock(commentData, 'getLastCommentSentByIDs', jest.fn().mockResolvedValueOnce(mockAudienceComment));

    const result = await func.checkMessageActivity(99, 999);
    expect(result).toEqual({
      inbox: { allowOn: EnumAllowedSendMessage.ALLOW_TAG, reason: 'ALLOW_TAG' },
      comment: { allowOn: EnumAllowedSendMessage.NOT_ALLOW, reason: 'NOT_ALLOW' },
    });

    expect(messageData.getLastMessagesSentByIDs).toBeCalled();
    expect(commentData.getLastCommentSentByIDs).toBeCalled();
  });
  test('checkMessageActivity | INBOX:ALLOW_TAG & COMMENT:PRIVATE_ONLY', async () => {
    const func = new FacebookMessageService();

    const mockAudienceMessage = [];
    const mockAudienceComment = [
      {
        hidden: false,
        replies: [],
        _id: '601a5b960874ddc11cd957bb',
        text: 'sdadsad',
        pageID: 91,
        audienceID: 3209,
        postID: '5feafa5612e09ef399c587b8',
        commentID: '3585315378218061_3680133398736258',
        payload: 'PAYLOAD',
        attachment: '{"id":"3585315378218061_3680133398736258"}',
        sentBy: 'AUDIENCE',
        isReply: false,
        createdAt: '2071-02-03T08:15:10.000Z',
        __v: 0,
      },
    ];

    mock(messageData, 'getLastMessagesSentByIDs', jest.fn().mockResolvedValue(mockAudienceMessage));
    mock(commentData, 'getLastCommentSentByIDs', jest.fn().mockResolvedValueOnce(mockAudienceComment));

    const result = await func.checkMessageActivity(99, 999);
    expect(result).toEqual({
      inbox: { allowOn: EnumAllowedSendMessage.ALLOW_TAG, reason: 'ALLOW_TAG' },
      comment: { allowOn: EnumAllowedSendMessage.PRIVATE_ONLY, reason: 'PRIVATE_ONLY' },
    });

    expect(messageData.getLastMessagesSentByIDs).toBeCalled();
    expect(commentData.getLastCommentSentByIDs).toBeCalled();
  });
  test('checkMessageActivity | INBOX:ALLOW_TAG & COMMENT:NOT_ALLOW', async () => {
    const func = new FacebookMessageService();

    const mockAudienceMessage = [
      {
        _id: '601bb7e9c2d48ace6da84cc7',
        object: 'page',
        pageID: 91,
        audienceID: 3209,
        createdAt: '2021-01-04T09:01:24Z',
        mid: 'm_kPIaDPoGzM3sVdsm7EzTDTQDyucjCpgNmO_zwgSWqolbqSXlJnAUA6bCJ9SJHsaYsG4lNvAlU98Jb9S-r1yCUA',
        text: 'WEll',
        attachments: 'null',
        sentBy: 'AUDIENCE',
        payload: 'PAYLOAD',
        messagingType: null,
        __v: 0,
      },
      {
        _id: '601bb7e9c2d48ace6da84cc7',
        object: 'page',
        pageID: 91,
        audienceID: 3209,
        createdAt: '2099-02-04T09:01:24Z',
        mid: 'm_kPIaDPoGzM3sVdsm7EzTDTQDyucjCpgNmO_zwgSWqolbqSXlJnAUA6bCJ9SJHsaYsG4lNvAlU98Jb9S-r1yCUA',
        text: 'WEll',
        attachments: 'null',
        sentBy: 'PAGE',
        payload: 'PAYLOAD',
        messagingType: 'MESSAGE_TAG',
        __v: 0,
      },
    ];
    const mockAudienceComment = [];
    // mock(helpers, 'getTimeRange', jest.fn().mockReturnValueOnce(1));
    mock(messageData, 'getLastMessagesSentByIDs', jest.fn().mockResolvedValue(mockAudienceMessage));
    mock(commentData, 'getLastCommentSentByIDs', jest.fn().mockResolvedValueOnce(mockAudienceComment));

    const result = await func.checkMessageActivity(99, 999);
    expect(result).toEqual({
      inbox: { allowOn: EnumAllowedSendMessage.ALLOW_TAG, reason: 'ALLOW_TAG' },
      comment: { allowOn: EnumAllowedSendMessage.NOT_ALLOW, reason: 'NOT_ALLOW' },
    });

    expect(messageData.getLastMessagesSentByIDs).toBeCalled();
    expect(commentData.getLastCommentSentByIDs).toBeCalled();
  });
  test('checkMessageActivity | INBOX:ALLOW_TAG & COMMENT:PRIVATE_ONLY', async () => {
    const func = new FacebookMessageService();

    const mockAudienceMessage = [
      {
        _id: '601bb7e9c2d48ace6da84cc7',
        object: 'page',
        pageID: 91,
        audienceID: 3209,
        createdAt: '2021-01-04T09:01:24Z',
        mid: 'm_kPIaDPoGzM3sVdsm7EzTDTQDyucjCpgNmO_zwgSWqolbqSXlJnAUA6bCJ9SJHsaYsG4lNvAlU98Jb9S-r1yCUA',
        text: 'WEll',
        attachments: 'null',
        sentBy: 'AUDIENCE',
        payload: 'PAYLOAD',
        messagingType: null,
        __v: 0,
      },
      {
        _id: '601bb7e9c2d48ace6da84cc7',
        object: 'page',
        pageID: 91,
        audienceID: 3209,
        createdAt: '2099-02-04T09:01:24Z',
        mid: 'm_kPIaDPoGzM3sVdsm7EzTDTQDyucjCpgNmO_zwgSWqolbqSXlJnAUA6bCJ9SJHsaYsG4lNvAlU98Jb9S-r1yCUA',
        text: 'WEll',
        attachments: 'null',
        sentBy: 'PAGE',
        payload: 'PAYLOAD',
        messagingType: 'MESSAGE_TAG',
        __v: 0,
      },
    ];
    const mockAudienceComment = [
      {
        hidden: false,
        replies: [],
        _id: '601a5b960874ddc11cd957bb',
        text: 'sdadsad',
        pageID: 91,
        audienceID: 3209,
        postID: '5feafa5612e09ef399c587b8',
        commentID: '3585315378218061_3680133398736258',
        payload: 'PAYLOAD',
        attachment: '{"id":"3585315378218061_3680133398736258"}',
        sentBy: 'AUDIENCE',
        isReply: false,
        createdAt: '2099-02-03T08:15:10.000Z',
        __v: 0,
      },
    ];
    // mock(helpers, 'getTimeRange', jest.fn().mockReturnValueOnce(1));
    mock(messageData, 'getLastMessagesSentByIDs', jest.fn().mockResolvedValue(mockAudienceMessage));
    mock(commentData, 'getLastCommentSentByIDs', jest.fn().mockResolvedValueOnce(mockAudienceComment));

    const result = await func.checkMessageActivity(99, 999);
    expect(result).toEqual({
      inbox: { allowOn: EnumAllowedSendMessage.ALLOW_TAG, reason: 'ALLOW_TAG' },
      comment: { allowOn: EnumAllowedSendMessage.PRIVATE_ONLY, reason: 'PRIVATE_ONLY' },
    });

    expect(messageData.getLastMessagesSentByIDs).toBeCalled();
    expect(commentData.getLastCommentSentByIDs).toBeCalled();
  });
  test('getAttachmentUrlExpired success', async () => {
    const func = new FacebookMessageService();
    const expired = { mid: 'm_pNnDTUrWzYTyFUDC4hILRXBeZLm6ZhLhXgd3be9QaYBGKb-g1UoAktX-4twQ3PigVNnmmPy_NbVZplL6N16TLw', attachments: [{ url: 'wrongURL' }] };
    const accesToken =
      '602fc5cf05d21e304d7540968e9174247a4ce6eb7fa4f11b26afd6e28ebb8be496e9af22821000b50fa9017e3b3559a0288f842d432bdea4647560a39f55617e5defe129c6f6d463f1b21b5c1d0112555bdc220627a6d2cf93b3a346e16eb8e6184fe8c1e7caa0be26e13c8174952cb3e365ca778be27712db1b66e34730e512fcee2e084b3271e21147c503110efb216fb40f9a633a046a7fcaf7a9e7e15896169f874cc4b8a82a8da4a63ba658908a86b350865789a9d9';
    const facebookResponse = {
      attachments: {
        data: [
          {
            image_data: {
              url: 'https://scontent.fbkk13-1.fna.fbcdn.net/v/t1.15752-9/271646808_339252281430415_1868154619568446312_n.png?_nc_cat=108&ccb=1-5&_nc_sid=58c789&_nc_eui2=AeHw3_1gGoou3XncBcQMYWmNfQLcQWPydxV9AtxBY_J3FR-4KPot8-7d7hUJOBkLb8nhgTVUVVdtETF16fv0fsZ_&_nc_ohc=ZqgVUK5M0h8AX8aaY1s&_nc_ht=scontent.fbkk13-1.fna&edm=AKVc4UAEAAAA&oh=03_AVJdSwdmUEfkrYvppY8_zdoF336dUDZH2SY1Sp43owo_hg&oe=622197D5',
            },
          },
        ],
      },
    };
    const message = {
      _id: '61fb8ad39d0deede200a7635',
      object: 'page',
      pageID: 320,
      audienceID: 6975,
      createdAt: '2022-02-03T07:57:03Z',
      mid: 'm_pNnDTUrWzYTyFUDC4hILRXBeZLm6ZhLhXgd3be9QaYBGKb-g1UoAktX-4twQ3PigVNnmmPy_NbVZplL6N16TLw',
      text: null,
      attachments: '[{"type":"image","payload":{"url":"wrongURL"}}]',
      sentBy: 'PAGE',
      payload:
        '{"object":"page","entry":[{"id":"180850905258728","time":1643875023700,"messaging":[{"sender":{"id":"180850905258728"},"recipient":{"id":"4727271380728334"},"timestamp":1643875023614,"message":{"mid":"m_pNnDTUrWzYTyFUDC4hILRXBeZLm6ZhLhXgd3be9QaYBGKb-g1UoAktX-4twQ3PigVNnmmPy_NbVZplL6N16TLw","is_echo":true,"app_id":1569132056623655,"attachments":[{"type":"image","payload":{"url":"https://scontent.xx.fbcdn.net/v/t1.15752-9/271646808_339252281430415_1868154619568446312_n.png?_nc_cat=108&ccb=1-5&_nc_sid=58c789&_nc_ohc=ZqgVUK5M0h8AX97sesS&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AVI0LjRxISCGvuqFfBoEIlpsyZZYCVQvXUA-Mv_ZtDX-4A&oe=622197D5"}}]}}]}]}',
      source: 'FACEBOOK',
      messagingType: null,
    };
    const expectResult = {
      _id: '61fb8ad39d0deede200a7635',
      attachments:
        '[{"type":"image","payload":{"url":"https://scontent.fbkk13-1.fna.fbcdn.net/v/t1.15752-9/271646808_339252281430415_1868154619568446312_n.png?_nc_cat=108&ccb=1-5&_nc_sid=58c789&_nc_eui2=AeHw3_1gGoou3XncBcQMYWmNfQLcQWPydxV9AtxBY_J3FR-4KPot8-7d7hUJOBkLb8nhgTVUVVdtETF16fv0fsZ_&_nc_ohc=ZqgVUK5M0h8AX8aaY1s&_nc_ht=scontent.fbkk13-1.fna&edm=AKVc4UAEAAAA&oh=03_AVJdSwdmUEfkrYvppY8_zdoF336dUDZH2SY1Sp43owo_hg&oe=622197D5"}}]',
      audienceID: 6975,
      createdAt: '2022-02-03T07:57:03Z',
      messagingType: null,
      mid: 'm_pNnDTUrWzYTyFUDC4hILRXBeZLm6ZhLhXgd3be9QaYBGKb-g1UoAktX-4twQ3PigVNnmmPy_NbVZplL6N16TLw',
      object: 'page',
      pageID: 320,
      payload:
        '{"object":"page","entry":[{"id":"180850905258728","time":1643875023700,"messaging":[{"sender":{"id":"180850905258728"},"recipient":{"id":"4727271380728334"},"timestamp":1643875023614,"message":{"mid":"m_pNnDTUrWzYTyFUDC4hILRXBeZLm6ZhLhXgd3be9QaYBGKb-g1UoAktX-4twQ3PigVNnmmPy_NbVZplL6N16TLw","is_echo":true,"app_id":1569132056623655,"attachments":[{"type":"image","payload":{"url":"https://scontent.xx.fbcdn.net/v/t1.15752-9/271646808_339252281430415_1868154619568446312_n.png?_nc_cat=108&ccb=1-5&_nc_sid=58c789&_nc_ohc=ZqgVUK5M0h8AX97sesS&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AVI0LjRxISCGvuqFfBoEIlpsyZZYCVQvXUA-Mv_ZtDX-4A&oe=622197D5"}}]}}]}]}',
      sentBy: 'PAGE',
      source: 'FACEBOOK',
      text: null,
    };
    PlusmarService.environment = { ...environmentLib };
    mock(messageData, 'getAttachmentUrlExpired', jest.fn().mockResolvedValue(facebookResponse));
    mock(messageData, 'findMessageByMessageID', jest.fn().mockResolvedValue(message));
    mock(messageData, 'updateMessageByMessageID', jest.fn().mockResolvedValue(true));
    const result = await func.getAttachmentUrlExpired(expired, accesToken);
    expect(messageData.getAttachmentUrlExpired).toBeCalled();
    expect(messageData.findMessageByMessageID).toBeCalled();
    expect(messageData.updateMessageByMessageID).toBeCalled();
    expect(result).toStrictEqual(expectResult);
  });
});
