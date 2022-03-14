import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IFacebookPageResponse, IPages, IFacebookPageWithBindedPageStatus, EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SettingModuleService } from '../../../../setting.module.service';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'reactor-room-setting-shop-owner-dialog',
  templateUrl: './setting-shop-owner-dialog.component.html',
  styleUrls: ['./setting-shop-owner-dialog.component.scss'],
})
export class SettingShopOwnerDialogComponent implements OnInit {
  currentPageIndex = Number(getCookie('page_index'));
  selectedPage: IFacebookPageResponse;
  theme: string;
  themeType = EnumAuthScope;

  facebookPagesWithPageStatus: IFacebookPageWithBindedPageStatus[];
  pages: [IPages];
  constructor(
    public dialogRef: MatDialogRef<SettingShopOwnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private pageService: PagesService,
    private userService: UserService,
    private settingModuleServer: SettingModuleService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data;
    this.pageService.getPages().subscribe(
      (pages: [IPages]) => {
        this.pages = pages;
      },
      (err) => {
        console.log('err: ', err);
      },
    );
    this.getFacebookPages();
  }
  getFacebookPages(): void {
    this.pageService.getPagesFromFacebook().subscribe((res) => {
      this.updateSelectablePages(res);
    });
  }

  updateSelectablePages(facebookPages: IFacebookPageResponse[]): void {
    //TODO: Match result with page
    this.pageService
      .getBindedPages(facebookPages)
      .pipe(
        tap((pagesFromFaceBook) => {
          this.facebookPagesWithPageStatus = pagesFromFaceBook;
          pagesFromFaceBook.map((page) => {
            if (this.pages !== undefined && page.facebook_page.name == this.pages[0].page_name) page.facebook_page.matchOwner = true;
            return page;
          });
        }),
      )
      .subscribe();
  }

  onSelectPage(page: IFacebookPageResponse): void {
    this.selectedPage = page;
    this.dialogRef.close(this.selectedPage);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  reAssignToken(): void {}

  pageHasBeenAdded(pageID: string): boolean {
    return Boolean(this.pages.find((page) => page.fb_page_id === pageID));
  }
}
