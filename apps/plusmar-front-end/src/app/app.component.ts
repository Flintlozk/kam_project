import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { GenericDialogComponent } from '@reactor-room/plusmar-cdk';
import { EnumAuthError, GenericButtonMode, GenericDialogData, GenericDialogMode } from '@reactor-room/itopplus-model-lib';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { webSocketErrorSubject } from './graphql.module';
import { LockScreenDialogComponent } from '@reactor-room/itopplus-cdk/lock-screen-dialog/lock-screen-dialog.component';
import { Subscription } from 'rxjs';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

declare const gtag: any;

@Component({
  selector: 'reactor-room-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  lockScreenDialogRef: MatDialogRef<LockScreenDialogComponent>;
  webSocketErrorSubscription: Subscription;

  clock = new Date().toString();
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public translate: TranslateService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private pagesService: PagesService,
  ) {
    router.events
      .pipe(
        distinctUntilChanged((previous: any, current: any) => {
          if (environment.production && current instanceof NavigationEnd) {
            return previous.url === current.url;
          }
          return true;
        }),
      )
      .subscribe((x: any) => {
        gtag('pageview', new Date());
      });

    this.handleLanuages(translate);
    this.setListeners(router);
  }

  handleLanuages(translate): void {
    const lang = localStorage.getItem('language') || translate.getBrowserLang() || 'th';

    translate.setDefaultLang(lang);
    translate.use(lang);
  }

  setListeners(router): void {
    // ? TODO : PERFORMANCE TEST
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('pageview', new Date());
      }
    });
  }
  ngOnDestroy(): void {
    this.webSocketErrorSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    if (webSocketErrorSubject) {
      this.webSocketErrorSubscription = webSocketErrorSubject.subscribe((errors) => {
        if (errors && !this.lockScreenDialogRef) {
          this.openWebsocketErrorDialog(errors);
        } else {
          this.closeWebsocketErrorDialog();
        }
      });
    }
    this.route.queryParams.subscribe((params) => {
      const errorParams: EnumAuthError = params.err;
      switch (errorParams) {
        case EnumAuthError.PERMISSION_DENIED:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Only owner have permission to manage the requested part'),
              title: this.translate.instant('Permission Denied'),
            },
            true,
            false,
          );
          break;
        case EnumAuthError.NO_SUBSCRIPTION_FROM_ID:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('No subscription from ID'),
              title: this.translate.instant('Error, Permisson denied!'),
            },
            true,
            false,
          );
          break;

        case EnumAuthError.NO_PAGE_AT_INDEX:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Request shop not exit'),
              title: this.translate.instant('Error, Unuable to connect to request shop!'),
            },
            true,
            false,
          );
          break;
        case EnumAuthError.INVALID_SUBSCRIPTION_PLAN:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Package invalid'),
              title: this.translate.instant('Error'),
            },
            true,
            false,
          );
          break;
        case EnumAuthError.INVALID_SUBSCRIPTION_PLAN_ID:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Package invalid'),
              title: this.translate.instant('Error'),
            },
            true,
            false,
          );
          break;
        case EnumAuthError.PAGE_REACHED_LIMIT:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Page Reached Limit'),
              title: this.translate.instant('Unable to create shop'),
            },
            true,
            false,
          );
          break;
        case EnumAuthError.USED_TO_HAVE_SUB:
          this.openPageMemberChangeDialog({
            text: this.translate.instant('Get remove from shop and no shop left'),
          });
          break;
        case EnumAuthError.NO_SUBSCRIPTION_AT_INDEX:
          this.openDashboardGenericDialog(
            {
              text: this.translate.instant('Get removed from shop'),
            },
            true,
          );
          break;
        case EnumAuthError.ALREADY_HAVE_SUB:
          this.openDashboardGenericDialog(
            {
              text: this.translate.instant('Already have subscription'),
            },
            false,
          );
          break;
        case EnumAuthError.ALREADY_MEMBER_OTHER_EMAIL:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Already Be A Member With Other Email Text'),
              title: this.translate.instant('Already Be A Member With Other Email Title'),
            },
            true,
            false,
          );
          break;
        case EnumAuthError.PACKAGE_INVALID:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Package Invalid Text'),
              title: this.translate.instant('Package Invalid Title'),
            },
            true,
            false,
          );
          break;
        case EnumAuthError.PAYMENT_FAILED:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Payment Fail Text'),
              title: this.translate.instant('Payment Fail Title'),
            },
            true,
            false,
          );
          break;
        case EnumAuthError.UNKNOWN:
          this.openDashboardSuccessDialog(
            {
              text: this.translate.instant('Something went wrong'),
              title: this.translate.instant('Error'),
            },
            true,
            false,
          );
          break;
        default:
          break;
      }
    });
  }

  openDashboardSuccessDialog(message, isError = false, isNeedToChangePage: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => {
      if (isNeedToChangePage) {
        this.pagesService.triggerPageChanging(false).subscribe();
      }
      void this.ngZone.run(() => this.router.navigateByUrl(environment.DEFAULT_ROUTE));
    });
  }

  openDashboardGenericDialog(message, isNeedToChangePage: boolean): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: {
        dialogMode: GenericDialogMode.CAUTION,
        buttonMode: GenericButtonMode.OK,
        text: message.text,
      } as GenericDialogData,
    });

    dialogRef.afterClosed().subscribe(() => {
      if (isNeedToChangePage) {
        this.pagesService.triggerPageChanging(false).subscribe();
      }
      window.location.href = environment.DEFAULT_ROUTE;
    });
  }

  openPageMemberChangeDialog(message): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: {
        dialogMode: GenericDialogMode.CAUTION,
        buttonMode: GenericButtonMode.OK,
        text: message.text,
      } as GenericDialogData,
    });

    dialogRef.afterClosed().subscribe(() => {
      void this.ngZone.run(() => this.router.navigateByUrl('/subscription/create'));
    });
  }
  openWebsocketErrorDialog(errors: Error[]) {
    this.lockScreenDialogRef = this.dialog.open(LockScreenDialogComponent, {
      width: isMobile() ? '90%' : '422px',
      disableClose: true,
      data: {
        // TODO: Change title text
        title: this.translate.instant('Something went wrong'),
        text: 'Websocket error',
      },
    });
  }
  closeWebsocketErrorDialog() {
    this.lockScreenDialogRef?.close();
    this.lockScreenDialogRef = null;
  }
}
