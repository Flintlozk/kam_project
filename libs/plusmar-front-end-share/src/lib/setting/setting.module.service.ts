import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IFacebookPageResponse, IShopDetail, IGetSocialNetWork, ICompanyInfo } from '@reactor-room/itopplus-model-lib';
@Injectable({
  providedIn: 'root',
})
export class SettingModuleService {
  private attributeData = {} as IFacebookPageResponse;
  private shopData = {} as IShopDetail;
  private socialNetwork = {} as IGetSocialNetWork;
  private companyInfo = {} as ICompanyInfo;

  public fetchFacebookData = new BehaviorSubject<IFacebookPageResponse>(this.attributeData);
  public fetchShopOwnerData = new BehaviorSubject<IShopDetail>(this.shopData);
  public fetchSocialNetwork = new BehaviorSubject<IGetSocialNetWork>(this.socialNetwork);
  public fetchCompanyInfo = new BehaviorSubject<ICompanyInfo>(this.companyInfo);
}
