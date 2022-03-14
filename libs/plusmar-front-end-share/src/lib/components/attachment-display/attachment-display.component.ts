import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { IAttachmentModelFromFacebook, IAttachmentModelPhysical, IPagesContext } from '@reactor-room/itopplus-model-lib';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-attachment-display',
  templateUrl: './attachment-display.component.html',
  styleUrls: ['./attachment-display.component.scss'],
})
export class AttachmentDisplayComponent implements OnInit {
  attachment$: Observable<IAttachmentModelPhysical>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() messageID: string;
  @Input() upload: boolean;
  constructor(private pageService: PagesService, private http: HttpClient) {}

  ngOnInit(): void {
    if (this.messageID !== '0') this.attachment$ = this.getMessageAttachments(this.messageID);
  }

  getMessageAttachments(messageID: string): Observable<IAttachmentModelPhysical> {
    return this.pageService.currentPage$.pipe(
      switchMap((page: IPagesContext) => {
        const url = `https://graph.facebook.com/${environmentLib.graphFBVersion}/${messageID}/attachments?access_token=${page?.accessToken}`;
        return this.http.get<IAttachmentModelFromFacebook>(url).pipe(
          takeUntil(this.destroy$),
          map((x) => x.data[0]),
        );
      }),
      takeUntil(this.destroy$),
    );
  }
}
