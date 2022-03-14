import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PostService } from '@reactor-room/plusmar-front-end-share/services/facebook/post/post.service';
import { IPost } from '@reactor-room/itopplus-model-lib';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostResolver implements Resolve<IPost[]> {
  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPost[]> {
    const parentAudienceID = +route.parent.paramMap.get('audienceId');
    let audienceID = +route.paramMap.get('audienceId');
    if (audienceID !== parentAudienceID && parentAudienceID !== 0) audienceID = parentAudienceID;
    return this.postService.getPosts(audienceID).pipe();
  }
}
