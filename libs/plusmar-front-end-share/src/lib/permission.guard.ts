import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { EnumPageMemberType, IUserContext } from '@reactor-room/itopplus-model-lib';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from './services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.userService.$userContext.pipe(
      switchMap((res: IUserContext) => {
        const { pages } = res;
        const currentPageIndex = Number(getCookie('page_index'));
        const pageRole = pages[currentPageIndex].pageRole;
        const roles = route.data.roles as Array<EnumPageMemberType>;
        if (roles.includes(pageRole)) return of(true);

        // return of(false);
        this.router.navigate(['/dashboard']);
      }),
    );
  }
}
