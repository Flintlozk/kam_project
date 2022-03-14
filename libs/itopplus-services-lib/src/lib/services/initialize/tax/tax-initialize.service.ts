import { createTax } from '../../../data/settings';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Pool } from 'pg';

export class TaxInitializeService {
  initTax(client: Pool, pageID: number): Promise<IHTTPResult> {
    return createTax(client, pageID);
  }
}
