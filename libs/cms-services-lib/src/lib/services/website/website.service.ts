import { environmentLib } from '@reactor-room/environment-services-backend';
import { getKeysFromSession, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { checkWebSiteGeneratorHandler, triggerWebSiteGeneratorHandler } from '../../domains';

export class WebsiteService {
  static triggerWebSiteGeneratorHandler = async (pageID: number, subscription: string, pageUUID: string): Promise<IHTTPResult> => {
    // const payload = await getKeysFromSession(PlusmarService.redisClient, environmentLib.cms.runnerNodeKey + pageID.toString());
    // if (payload === null) {
    //   // trigger node
    //   const readyNodeName = (await getKeysFromSession(PlusmarService.redisClient, environmentLib.cms.readyNodeKey)) as string[];
    //   if (readyNodeName[0]) {
    //     const useNode = readyNodeName[0];
    //     const setKey = { nodeName: useNode };
    //     await setSessionValue(PlusmarService.redisClient, 'readyNode', readyNodeName.splice(1));
    //     await setSessionValue(PlusmarService.redisClient, environmentLib.cms.runnerNodeKey + pageID.toString() + pageID.toString(), setKey);
    //     await triggerWebSiteGeneratorHandler(pageID);
    //   } else {
    //     throw Error('No ready Node');
    //   }
    // } else {
    //   // kill process
    // }
    //TODO: Clean nodes
    // PING -> CURL -> axios route  /checkDB -> PG/MONGO -> 200 ? redis.del(xxxx)
    const readyNodeUrls = (await getKeysFromSession(PlusmarService.redisClient, environmentLib.cms.readyNodeKey)) as string[];
    const checkNodeUrls = [];
    for (const readyNodeUrl of readyNodeUrls) {
      let result;
      try {
        result = await checkWebSiteGeneratorHandler(readyNodeUrl);
      } catch {
        result = { status: 404, data: 'not ready' };
      }
      if (result.status === 200) {
        checkNodeUrls.push(readyNodeUrl);
      }
    }
    setSessionValue(PlusmarService.redisClient, environmentLib.cms.readyNodeKey, checkNodeUrls);
    // RAND MAX TOTOAL ARRAY
    const index = getRandomInt(checkNodeUrls.length);
    console.log('checkNodeUrls[index]: ', checkNodeUrls[index]);
    if (checkNodeUrls[index]) {
      return await triggerWebSiteGeneratorHandler(pageID, subscription, pageUUID, checkNodeUrls[index]);
    } else {
      throw Error('Cannot send message to generator handler');
    }
  };
}
function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
