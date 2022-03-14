import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IAudienceWithCustomer } from '@reactor-room/itopplus-model-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenGeneratorService } from '../../services/token-generater.service';

@Injectable({ providedIn: 'root' })
export class AudienceResolver implements Resolve<IAudienceWithCustomer> {
  constructor(private audienceService: AudienceService, public tokenGeneratorService: TokenGeneratorService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAudienceWithCustomer> {
    const token = this.tokenGeneratorService.generateToken();
    const parentAudienceID = +route.parent.paramMap.get('audienceId');
    let audienceID = +route.paramMap.get('audienceId');
    if (audienceID !== parentAudienceID && parentAudienceID !== 0) audienceID = parentAudienceID;
    return this.audienceService.getAudienceByID(audienceID, token).pipe(
      map((result) => {
        return {
          ...result,
          token,
        };
      }),
    );
  }
}
