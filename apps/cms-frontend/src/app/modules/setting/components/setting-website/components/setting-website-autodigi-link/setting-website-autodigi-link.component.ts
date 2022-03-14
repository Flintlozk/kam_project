import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IAutodigiWebsiteList } from '@reactor-room/autodigi-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { environment } from 'apps/cms-frontend/src/environments/environment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingAutodigiLinkService } from '../../../../services/setting-autodigi-link.service';
import { SettingGeneralService } from '../../../../services/setting-general/setting-general-service';

@Component({
  selector: 'cms-next-setting-website-autodigi-link',
  templateUrl: './setting-website-autodigi-link.component.html',
  styleUrls: ['./setting-website-autodigi-link.component.scss'],
})
export class SettingWebsiteAutodigiLinkComponent implements OnInit, OnDestroy {
  autodigiUrl = environment.AUTODIGI_URL;
  destroy$: Subject<void> = new Subject<void>();

  isLink: boolean;
  isLinkProcessing = false;
  websiteList: IAutodigiWebsiteList[];

  websiteGroup: FormGroup;
  intervalCheckerCount = 0;
  maxIntervalChecker = 2;
  interval: NodeJS.Timeout;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private settingAutodigiLinkService: SettingAutodigiLinkService,
    private router: Router,
    private settingService: SettingGeneralService,
  ) {}

  get getLinkWebsiteGroup(): FormArray {
    return <FormArray>this.websiteGroup.get('linkedWebsite');
  }
  get getUnlinkWebsiteGroup(): FormArray {
    return <FormArray>this.websiteGroup.get('unlinkedWebsite');
  }

  ngOnInit(): void {
    this.initForm();
    this.checkSubscriptionLinkStatus();

    this.settingService
      .getUnsaveDialog()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newRoute) => {
        this.onDetectRouteChange(newRoute);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  intervalCheckingLink(): void {
    this.interval = setInterval(() => {
      this.checkSubscriptionLinkStatus();
      this.intervalCheckerCount++;
      if (this.intervalCheckerCount >= this.maxIntervalChecker) {
        clearInterval(this.interval);

        this.isLinkProcessing = false;
      }
    }, 1000);
  }

  linkAutodigiWebsite(): void {
    this.isLinkProcessing = true;
    this.settingAutodigiLinkService
      .generateAutodigiLink()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ linkKey, linkStatus }) => {
        if (!linkStatus) {
          window.open(`${this.autodigiUrl}/link-more-commerce/${linkKey}`, '__blank');
          this.intervalCheckingLink();
        } else {
          this.isLinkProcessing = false;
          this.checkSubscriptionLinkStatus();
        }
      });
  }

  checkSubscriptionLinkStatus(): void {
    this.settingAutodigiLinkService
      .checkSubscriptionLinkStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const { isLink, websites } = result;
        this.isLink = isLink;
        if (isLink) {
          if (this.interval) clearInterval(this.interval);

          this.websiteList = websites;
          this.initFormValue();
        }
      });
  }

  initForm(): void {
    this.websiteGroup = this.formBuilder.group({
      linkedWebsite: this.formBuilder.array([]),
      unlinkedWebsite: this.formBuilder.array([]),
    });
  }

  initFormValue(): void {
    const link = this.websiteList.filter((x) => x.linkStatus);
    const formArray = [<FormArray>this.websiteGroup.controls['linkedWebsite']];
    const mapper = [link];

    mapper.forEach((linking, mapIndex) => {
      for (let index = 0; index < linking.length; index++) {
        formArray[mapIndex].push(
          this.formBuilder.group({
            websiteID: linking[index].websiteID,
            websiteName: linking[index].websiteName,
            isPrimary: linking[index].isPrimary,
          }),
        );
      }
    });
  }

  doSetPrimary(index: number): void {
    this.getLinkWebsiteGroup.controls.forEach((x, idx) => {
      if (index !== idx) x.get('isPrimary').patchValue(false);
      else x.get('isPrimary').patchValue(true);
    });
    const value = this.getLinkWebsiteGroup.at(index);
    const websiteIdAtIndex = value.get('websiteID').value;
    this.setPrimaryAutodigiLink(websiteIdAtIndex);
  }

  setPrimaryAutodigiLink(autodigiWebsiteID: string): void {
    this.settingAutodigiLinkService.setPrimaryAutodigiLink(autodigiWebsiteID).subscribe(
      () => {
        this.showError('Success', StatusSnackbarType.SUCCESS);
      },
      (err) => {
        this.showError(err.message, StatusSnackbarType.ERROR);
      },
    );
  }

  showError(message: string, type: StatusSnackbarType): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type,
        message,
      } as StatusSnackbarModel,
    });
  }

  unlinkAutodigi(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Unlink Confirmation',
        content: 'Are you sure to unlink Autodigi ?',
      } as ConfirmDialogModel,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((yes) => {
        if (yes) this.emitUnlinkToBackend();
      });
  }

  emitUnlinkToBackend(): void {
    this.settingAutodigiLinkService.doUnlinkAutodigi().subscribe(
      () => {
        this.initForm(); // Reset
        this.checkSubscriptionLinkStatus();
        this.showError('Success', StatusSnackbarType.SUCCESS);
      },
      (err) => {
        this.showError(err.message, StatusSnackbarType.ERROR);
      },
    );
  }
  onDetectRouteChange(nextRoute: string[]): void {
    void this.router.navigate(nextRoute);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
