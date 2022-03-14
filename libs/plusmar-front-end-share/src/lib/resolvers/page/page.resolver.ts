import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { IPages } from '@reactor-room/itopplus-model-lib';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PageResolver implements Resolve<IPages> {
  constructor(private pageService: PagesService) {}
  pageIndex = Number(getCookie('page_index'));

  resolve(): Observable<IPages> {
    return this.pageService.getPages().pipe(
      take(1),
      map((pages) => pages[this.pageIndex]),
    );
  }
}
