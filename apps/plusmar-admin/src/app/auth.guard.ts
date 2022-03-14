import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, ObservableInput, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginService } from './modules/login/login.service';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router, private apollo: Apollo, private authService: AuthService) {}

  checkAuth(): Observable<boolean> {
    return this.loginService.verifyAuth().pipe(
      switchMap((httpResult: IHTTPResult): ObservableInput<boolean> => {
        const isSuccess = httpResult.status === 200;
        if (isSuccess) return of(isSuccess);
        if (!isSuccess) return this.router.navigate(['/']);
      }),
    );
  }

  // eslint-disable-next-line
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const result = this.checkAuth();
    return result;
  }
}
