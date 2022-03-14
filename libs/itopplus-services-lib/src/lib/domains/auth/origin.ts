import { PaypemntProviderUserAgent } from '@reactor-room/model-lib';
import { IncomingHttpHeaders } from 'http';
import { InvalidOrigin } from '../../errors';

export function checkOrigin(expectOrigin: string, headers: IncomingHttpHeaders): boolean {
  if (headers.origin === undefined && expectOrigin.split('//')[1] === headers.host) {
    return true;
  }
  if (headers.origin === undefined && expectOrigin.split('//')[1] === headers.host.split(':')[0]) {
    return true;
  }

  if (headers['user-agent'] === PaypemntProviderUserAgent.AGENT_2C2P) {
    return true;
  }

  if (headers['user-agent'].indexOf(PaypemntProviderUserAgent.OMISE) >= 0) {
    return true;
  }

  if (expectOrigin !== headers.origin) {
    throw new InvalidOrigin();
  }
  return true;
}
