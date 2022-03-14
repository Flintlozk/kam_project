import { axiosGetJsonResponse, axiosGetJsonResponseWithHandleError } from '@reactor-room/itopplus-back-end-helpers';
import { ILineProfile, ILineRoomOrGroupMember } from '@reactor-room/itopplus-model-lib';

export const getLineProfileUser = async (channeltoken: string, userId: string): Promise<ILineProfile> => {
  const LINE_HEADER = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${channeltoken}`,
  };
  const uri = `https://api.line.me/v2/bot/profile/${userId}`;
  return await axiosGetJsonResponseWithHandleError(uri, LINE_HEADER);
};

export const getRoomMembers = async (channeltoken: string, roomId: string): Promise<ILineRoomOrGroupMember> => {
  const LINE_HEADER = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${channeltoken}`,
  };
  const uri = `https://api.line.me/v2/bot/room/${roomId}/members/ids`;
  return await axiosGetJsonResponse(uri, LINE_HEADER);
};

export const getRoomMemberProfile = async (channeltoken: string, roomId: string, userId: string): Promise<ILineProfile> => {
  const LINE_HEADER = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${channeltoken}`,
  };
  const uri = `https://api.line.me/v2/bot/room/${roomId}/member/${userId}`;
  return await axiosGetJsonResponse(uri, LINE_HEADER);
};

export const getGroupMembers = async (channeltoken: string, groupId: string): Promise<ILineRoomOrGroupMember> => {
  const LINE_HEADER = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${channeltoken}`,
  };
  const uri = `https://api.line.me/v2/bot/group/${groupId}/members/ids`;
  return await axiosGetJsonResponse(uri, LINE_HEADER);
};

export const getGroupMemberProfile = async (channeltoken: string, groupId: string, userId: string): Promise<ILineProfile> => {
  const LINE_HEADER = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${channeltoken}`,
  };
  const uri = `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`;
  return await axiosGetJsonResponse(uri, LINE_HEADER);
};
