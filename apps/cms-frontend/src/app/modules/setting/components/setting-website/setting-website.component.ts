import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IWebsiteConfigGeneral, RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { IHeading } from '../../../../components/heading/heading.model';
import { SettingGeneralService } from '../../services/setting-general/setting-general-service';
import { getKeyByValue } from '@reactor-room/itopplus-front-end-helpers';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'cms-next-setting-website',
  templateUrl: './setting-website.component.html',
  styleUrls: ['./setting-website.component.scss'],
})
export class SettingWebsiteComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tabgroup') tabs: MatTabGroup;
  indexes = {
    general: 0,
    seo: 1,
    metatag: 2,
    css: 3,
    dataprivacy: 4,
    autodigi: 5,
  };
  heading: IHeading = {
    title: 'Website Settings',
    subTitle: 'Settings / Website Settings',
  };
  selectedIndex: number;
  configGeneral: IWebsiteConfigGeneral;
  destroy$ = new Subject();
  webisteSettingForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private settingGeneralService: SettingGeneralService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ tab }) => {
      this.selectedIndex = tab ? this.indexes[tab] : 0;
    });
    this.webisteSettingForm = this.getWebSiteSettingFromGroup();
    this.settingGeneralService.setCurrentSection(this.selectedIndex);
  }

  ngAfterViewInit(): void {
    try {
      this.tabs._handleClick = (tab, header, index) => {
        const newRoute = ['setting', 'website', getKeyByValue(this.indexes, index)];
        this.settingGeneralService.oldIndex = _.cloneDeep(this.settingGeneralService.getCurrentSection());
        if (this.settingGeneralService.getCurrentSection() !== index) {
          this.settingGeneralService.triggerUnsaveAction(newRoute);
          if (!this.settingGeneralService.isTabChanging) this.settingGeneralService.setCurrentSection(index);
        }
      };
    } catch (error) {
      console.log('something happended on tab : ', error);
    }
  }
  getWebSiteSettingFromGroup(): FormGroup {
    const webisteSettingFormGroup = this.fb.group({});
    return webisteSettingFormGroup;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }
  onCancelWebsiteSetting(): void {
    void this.router.navigate([RouteLinkCmsEnum.DASHBOARD]);
  }

  onSaveWebsiteSetting(): void {
    this.settingGeneralService.saveAction();
  }
}
