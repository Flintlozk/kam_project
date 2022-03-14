import { FileService } from '@reactor-room/itopplus-services-lib';
import { Request } from 'express';
import { expressDynamicHandler } from '../express-handler';

class FileController {
  public static instance;

  public static fileService: FileService;

  constructor() {
    FileController.fileService = new FileService();
  }
  public static getInstance() {
    if (!FileController.instance) FileController.instance = new FileController();
    return FileController.instance;
  }

  async getFileHandler(req: Request): Promise<string> {
    const { audienceID, messageID, filename } = req.params;
    const result = await FileController.fileService.getFile({ audienceID, messageID, filename });
    return result;
  }
}

const fileControllerInstance: FileController = FileController.getInstance();

export const fileController = {
  getFile: expressDynamicHandler({
    handler: fileControllerInstance.getFileHandler,
    validator: (x) => x,
  }),
};
