import { redisWrapperFunction } from '@reactor-room/itopplus-back-end-helpers';
import { ELineRedisKey, ILineProfile, ILineRoomOrGroupMember } from '@reactor-room/itopplus-model-lib';
import { getGroupMemberProfile, getGroupMembers, getLineProfileUser, getRoomMemberProfile, getRoomMembers } from '../../data/line/profile.data';
import { getRedisExpiredTime } from '../../domains/line/line.domain';
import { PlusmarService } from '../plusmarservice.class';

export class LineService {
  constructor() {}
  async getLineProfileUser(token: string, userID: string): Promise<ILineProfile> {
    // return await getLineProfileUser(token, userID);
    const redisKey = `${ELineRedisKey.LINE_PROFILE}${userID}`;
    return await redisWrapperFunction<ILineProfile, [string, string]>(PlusmarService.redisClient, redisKey, getLineProfileUser, [token, userID], getRedisExpiredTime());
  }

  async getRoomMembers(token: string, roomID: string): Promise<ILineRoomOrGroupMember> {
    return await getRoomMembers(token, roomID);

    // const redisKey = `${ELineRedisKey.LINE_ROOM_MEMBER}${roomID}`;
    // return await redisWrapperFunction<ILineRoomOrGroupMember, [string, string]>(PlusmarService.redisClient, redisKey, getRoomMembers, [token, roomID], getRedisExpiredTime());
  }

  async getRoomMemberProfile(token: string, roomID: string, userID: string): Promise<ILineProfile> {
    return await getRoomMemberProfile(token, roomID, userID);

    // const redisKey = `${ELineRedisKey.LINE_ROOM_MEMBER_PROFILE}${roomID}_${userID}`;
    // return await redisWrapperFunction<ILineProfile, [string, string, string]>(
    //   PlusmarService.redisClient,
    //   redisKey,
    //   getRoomMemberProfile,
    //   [token, roomID, userID],
    //   getRedisExpiredTime(),
    // );
  }

  async getGroupMembers(token: string, groupID: string): Promise<ILineRoomOrGroupMember> {
    return await getGroupMembers(token, groupID);

    // const redisKey = `${ELineRedisKey.LINE_GROUP_MEMBER}${groupID}`;
    // return await redisWrapperFunction<ILineRoomOrGroupMember, [string, string]>(PlusmarService.redisClient, redisKey, getGroupMembers, [token, groupID], getRedisExpiredTime());
  }

  async getGroupMemberProfile(token: string, groupID: string, userID: string): Promise<ILineProfile> {
    return await getGroupMemberProfile(token, groupID, userID);

    // const redisKey = `${ELineRedisKey.LINE_GROUP_MEMBER_PROFILE}${groupID}_${userID}`;
    // return await redisWrapperFunction<ILineProfile, [string, string, string]>(
    //   PlusmarService.redisClient,
    //   redisKey,
    //   getGroupMemberProfile,
    //   [token, groupID, userID],
    //   getRedisExpiredTime(),
    // );
  }
}
