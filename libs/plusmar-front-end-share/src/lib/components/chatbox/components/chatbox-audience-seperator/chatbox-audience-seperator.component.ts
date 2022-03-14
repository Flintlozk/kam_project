import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { IAudienceHistorySingleRow } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-chatbox-audience-seperator',
  templateUrl: './chatbox-audience-seperator.component.html',
  styleUrls: ['./chatbox-audience-seperator.component.scss'],
})
export class ChatboxAudienceSeperatorComponent implements OnInit, OnDestroy {
  @Input() previousAudienceID: number;
  @Input() platform: AudiencePlatformType;

  reason: IAudienceHistorySingleRow;

  EAudiencePlatformType = AudiencePlatformType;

  destroy$: Subject<void> = new Subject<void>();

  constructor(private audienceService: AudienceService, public translateService: TranslateService) {}

  ngOnInit(): void {
    this.getAudienceCloseReason(this.previousAudienceID);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  getAudienceCloseReason(audienceID: number): void {
    this.audienceService
      .getAudienceHistoryByID(audienceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((reason) => {
        if (reason) {
          this.reason = reason;
        }
      });
  }
}
