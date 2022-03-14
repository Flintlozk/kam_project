import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IComment } from '@reactor-room/itopplus-model-lib';
import { Observable } from 'rxjs';
import { CommentService } from '@reactor-room/plusmar-front-end-share/services/facebook/comment/comment.service';

@Injectable({ providedIn: 'root' })
export class CommentResolver implements Resolve<IComment> {
  constructor(private commentService: CommentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IComment> {
    const parentAudienceID = +route.parent.paramMap.get('audienceId');
    let audienceID = +route.paramMap.get('audienceId');
    if (audienceID !== parentAudienceID && parentAudienceID !== 0) audienceID = parentAudienceID;
    return this.commentService.getLatestComment(audienceID).pipe();
  }
}
