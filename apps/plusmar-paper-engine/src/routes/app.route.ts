import { Express } from 'express';
import { paperController } from '../controllers/paper.controller';
import { getPaperLabelData } from '../domain/fake-data.domain';

export const routeRegister = (app: Express): void => {
  app.get('/order/label/:paperSize', paperController.getLabelPayload);
  app.get('/order/receipt/:paperSize', paperController.getReceiptPayload);

  app.get('/paper', (req, res) => {
    const type = {
      FLASH: 'flash',
      THAIPOST: 'thaipost',
      JT: 'j_and_t',
      DEFAULT: 'default',
    };
    const size = {
      A4: 'A4',
      A4DROPOFF: 'A4_dropoff',
      A4BOOK: 'A4_book',
      A4DROPOFF_COD: 'A4_dropoff_cod',
      A4COD: 'A4_cod',
      A4MANUAL: 'A4_manual',
      S100x150: '100x150',
      S100x150DROPOFF: '100x150_dropoff',
      S100x150DROPOFF_COD: '100x150_dropoff_cod',
      S100x150COD: '100x150_cod',
      S100x150MANUAL: '100x150_manual',
      S100x150BOOK: '100x150_book',
    };

    // **/reactor-room/apps/plusmar-paper-engine/src/assets/views/reports/#PATH_OF_FILE
    res.render(`reports/labels/${type.DEFAULT}/${size.S100x150}.ejs`, getPaperLabelData());
  });
};
