import { environmentLib } from '@reactor-room/environment-services-backend';
import { getKeysFromSession, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { getIpAddress } from '@reactor-room/cms-services-lib';

export async function registerReadyNode() {
  let address = getIpAddress();
  const port = process.env.PORT || 3001;
  address = address + ':' + port;
  const readyNode = (await getKeysFromSession(PlusmarService.redisClient, environmentLib.cms.readyNodeKey)) as string[];
  const isReadyNodeExist = readyNode !== null;
  if (isReadyNodeExist) {
    const haveThisNode = readyNode.indexOf(address) !== -1;
    if (haveThisNode) {
      //already exsiting in readyNode
    } else {
      readyNode.push(address);
      await setSessionValue(PlusmarService.redisClient, environmentLib.cms.readyNodeKey, readyNode);
    }
  } else {
    await setSessionValue(PlusmarService.redisClient, environmentLib.cms.readyNodeKey, [address]);
  }
  console.log(await getKeysFromSession(PlusmarService.redisClient, environmentLib.cms.readyNodeKey));
}
