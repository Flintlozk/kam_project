// import { axiosGetJsonResponse } from '@reactor-room/itopplus-back-end-helpers';
// import { ILineProfile, ILineRoomOrGroupMember } from '@reactor-room/itopplus-model-lib';

// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// ! PREPARE FOR DELETE
// export class LineProfileDomain {
//   async getProfileUser(channeltoken: string, userId: string): Promise<ILineProfile> {
//     try {
//       const LINE_HEADER = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${channeltoken}`,
//       };
//       const uri = `https://api.line.me/v2/bot/profile/${userId}`;
//       return await axiosGetJsonResponse(uri, LINE_HEADER);
//     } catch (err) {
//       console.log('err :::', err.message);
//       return null;
//     }
//   }

//   async getRoomMembers(channeltoken: string, roomId: string): Promise<ILineRoomOrGroupMember> {
//     try {
//       const LINE_HEADER = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${channeltoken}`,
//       };
//       const uri = `https://api.line.me/v2/bot/room/${roomId}/members/ids`;
//       return await axiosGetJsonResponse(uri, LINE_HEADER);
//     } catch (err) {
//       console.log('err :::', err.message);
//       return null;
//     }
//   }

//   async getRoomMemberProfile(channeltoken: string, roomId: string, userId: string): Promise<ILineProfile> {
//     try {
//       const LINE_HEADER = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${channeltoken}`,
//       };
//       const uri = `https://api.line.me/v2/bot/room/${roomId}/member/${userId}`;
//       return await axiosGetJsonResponse(uri, LINE_HEADER);
//     } catch (err) {
//       console.log('err :::', err.message);
//       return null;
//     }
//   }

//   async getGroupMembers(channeltoken: string, groupId: string): Promise<ILineRoomOrGroupMember> {
//     try {
//       const LINE_HEADER = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${channeltoken}`,
//       };
//       const uri = `https://api.line.me/v2/bot/group/${groupId}/members/ids`;
//       return await axiosGetJsonResponse(uri, LINE_HEADER);
//     } catch (err) {
//       console.log('err :::', err.message);
//       return null;
//     }
//   }

//   async getGroupMemberProfile(channeltoken: string, groupId: string, userId: string): Promise<ILineProfile> {
//     try {
//       const LINE_HEADER = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${channeltoken}`,
//       };
//       const uri = `https://api.line.me/v2/bot/group/${groupId}/member/${userId}`;
//       return await axiosGetJsonResponse(uri, LINE_HEADER);
//     } catch (err) {
//       console.log('err :::', err.message);
//       return null;
//     }
//   }
// }
