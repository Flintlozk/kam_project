import { SharedService } from '../../services/shared/shared.service';
import { PageExitsType } from '@reactor-room/itopplus-model-lib';
class SharedController {
  public static instance;
  public static sharedService: SharedService;

  public static getInstance() {
    if (!SharedController.instance) SharedController.instance = new SharedController();
    return SharedController.instance;
  }

  constructor() {
    SharedController.sharedService = new SharedService();
  }

  async checkPageExitsHandler(payload, type_exits: PageExitsType): Promise<boolean> {
    return await SharedController.sharedService.pageExist(payload, type_exits);
  }
}

export const SharedCtrl: SharedController = SharedController.getInstance();
