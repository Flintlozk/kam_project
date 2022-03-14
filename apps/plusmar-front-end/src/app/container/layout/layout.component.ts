import { Component, OnInit } from '@angular/core';
import { FocusModeService } from '@reactor-room/plusmar-front-end-share/services/focusmode.service';
import { TranslateService } from '@ngx-translate/core';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'reactor-room-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  focusModeStatus = true;
  wizardModeStatus = false;
  toggleLoader = false;
  menuStatus = false;

  destroy$: Subject<void> = new Subject<void>();

  constructor(public layoutCommonService: LayoutCommonService, private mode: FocusModeService, public translate: TranslateService) {
    this.layoutCommonService.shareMenuStatus.pipe(delay(100)).subscribe((result) => {
      this.menuStatus = result;
    });
  }

  ngOnInit(): void {
    this.toggleLoaderSubject();
    setTimeout(() => {
      this.mode.sharedWizardMode.subscribe((mode) => (this.wizardModeStatus = mode));
      this.mode.sharedFocusMode.subscribe((mode) => (this.focusModeStatus = mode));
    });
  }

  toggleLoaderSubject(): void {
    this.layoutCommonService.toggleUILoader.pipe(takeUntil(this.destroy$)).subscribe((toggle) => {
      this.toggleLoader = toggle;
    });
  }
}
