import { IQueueingAggregation, QueueingMethodEnum, QueueingStatusEnum } from '@reactor-room/itopplus-model-lib';
import { GenericRecursiveMessageType } from '@reactor-room/model-lib';
import { Express, Request, Response } from 'express';
// import { ManageMessageQueueingService } from '../services';
import { checkWRK } from './middleware.route';

export const loadTestRoute = (app: Express): void => {
  app.get('/', (req, res) => {
    res.send('Hello');
  });
  app.post('/inventory-load', checkWRK, async (req: Request, res: Response) => {
    // const manageMessageQueueingService = new ManageMessageQueueingService();

    const lists: IQueueingAggregation[] = [
      {
        _id: {
          pageID: 91,
        },
        data: [
          {
            _id: '61f907f7e6eb57d324d0a939',
            pageID: 91,
            payload: [
              {
                status: QueueingStatusEnum.PENDING,
                method: QueueingMethodEnum.UPDATE_MORE_COMMERCE,
                retryAttempt: 0,
                _id: '61f8d5e9a2ecfb8ad44b51c6',
                type: GenericRecursiveMessageType.UPDATE_INVENTORY_V2,
                options: {
                  pageID: 91,
                  orderID: null,
                  processID: '91_1643697640065',
                  isRecursion: true,
                  inventory: [
                    {
                      variantID: 705,
                      productID: 511,
                      operationType: 'INCREASE',
                      stockToUpdate: 1,
                      inventoryChannel: 'MORE_COMMERCE',
                    },
                  ],
                },
                createdAt: new Date('2022-02-01T06:40:41.456Z'),
                updatedAt: new Date('2022-02-01T08:55:49.508Z'),
              },
            ],
            status: QueueingStatusEnum.PENDING,
            createdAt: new Date('2022-02-01T06:40:41.457Z'),
            updatedAt: new Date('2022-02-01T08:55:49.477Z'),
          },
        ],
      },
    ];
    // await manageMessageQueueingService.loadTestUpdateProductQueueingSystem(lists);
    res.sendStatus(200);
  });
};
