import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IFacebookCredential } from '@reactor-room/model-lib';
import { environment } from 'apps/cms-frontend/src/environments/environment';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'cms-next-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewChecked, OnDestroy {
  initProcessing = false;
  facebookAppID = environment.facebookAppID as string;
  facebookAppSecret = environment.facebookAppSecret as string;
  facebookLoginScope = environment.facebookLoginScope as string[];
  destroy$ = new Subject();

  pageIndex = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  checkLoginStatus(): void {
    const token = getCookie('access_token');
    if (token) {
      this.initProcessing = true;
    }
  }

  loginHandler(auth: IFacebookCredential): void {
    of(true)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.authService.state1Login(auth)),
        switchMap(() => this.authService.state2CheckSubscription()),
        switchMap(() => this.authService.state3CheckUser()),
        switchMap(() => this.authService.state4CheckPage()),
      )
      .subscribe(
        () => {
          this.initProcessing = true;
        },
        (err) => {
          console.log('err [LOG]:--> ', err);
        },
      );
  }

  processCallback(): void {
    console.error('Process Error');
    this.initProcessing = false;
  }

  showExceptionError(message: string): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message,
      } as StatusSnackbarModel,
    });
  }
}
