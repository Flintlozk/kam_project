import axios from 'axios';
export async function triggerWebSiteGeneratorHandler(pageID: number, subscription: string, pageUUID: string, url: string) {
  const result = await axios({
    method: 'post',
    url: `http://${url}/generator/${pageID}/${subscription}/${pageUUID}`,
  }).catch((err) => {
    throw err;
  });
  return result.data;
}
export async function checkWebSiteGeneratorHandler(url: string) {
  const result = await axios({
    method: 'get',
    timeout: 1000,
    url: `http://${url}/mongostatus`,
  }).catch((err) => {
    throw err;
  });
  return result;
}
