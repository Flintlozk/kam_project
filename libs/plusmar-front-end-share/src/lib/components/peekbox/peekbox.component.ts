import { Component, HostListener, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fadeInOutFastestAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { AudienceViewType, ChatboxView, IAudienceWithCustomer } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-peekbox',
  templateUrl: './peekbox.component.html',
  styleUrls: ['./peekbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInOutFastestAnimation],
})
export class PeekboxComponent implements OnInit, OnDestroy {
  chatViewMode: ChatboxView = ChatboxView.PEEK;
  togglePrivateInChat = new Subject<string>();

  destroy$: Subject<boolean> = new Subject<boolean>();

  audience: IAudienceWithCustomer;
  routeType: AudienceViewType = AudienceViewType.FOLLOW;
  // @Output() closeResponse = new EventEmitter<boolean>();
  constructor(
    private audienceService: AudienceService,
    public dialogRef: MatDialogRef<PeekboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { audience: IAudienceWithCustomer },
  ) {}

  @HostListener('window:keydown.escape', ['$event'])
  escapeKeydown(): void {
    this.closePeekBox(false);
  }

  ngOnInit(): void {
    this.getLatestAudienceData(this.data.audience.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  closePeekBox(closeWithUpdate: boolean): void {
    this.dialogRef.close(closeWithUpdate);
  }

  getLatestAudienceData(audienceID: number): void {
    this.audienceService
      .getAudienceByID(audienceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((audience) => {
        this.audience = audience;
      });
  }
}
