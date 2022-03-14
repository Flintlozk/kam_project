import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { EnumSelectThemeSetting, EnumThemeDeviceIcon } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../modules/cms-admin/services/theme.service';

@Component({
  selector: 'reactor-room-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss'],
})
export class DevicesListComponent implements OnInit {
  EnumSelectThemeSetting: EnumSelectThemeSetting;
  isPreviewMode: boolean;
  destroy$ = new Subject();
  @Input() devices: FormArray;
  @Input() mode: EnumSelectThemeSetting;
  @Input() selectedIndex: number;
  @Output() parentHandler = new EventEmitter();
  constructor(private themeService: ThemeService) {
    this.themeService.getIsPreviewMode.pipe(takeUntil(this.destroy$)).subscribe((status) => (this.isPreviewMode = status));
  }

  ngOnInit(): void {}
  getImagePath(type: EnumThemeDeviceIcon): string {
    switch (type) {
      case EnumThemeDeviceIcon.EXTRA_WILD: {
        return '../../../../../assets/shared/devices/1920px.svg';
      }
      case EnumThemeDeviceIcon.WILD: {
        return '../../../../../assets/shared/devices/1360px.svg';
      }
      case EnumThemeDeviceIcon.NORMAL: {
        return '../../../../../assets/shared/devices/1024px.svg';
      }
      case EnumThemeDeviceIcon.TABLET: {
        return '../../../../../assets/shared/devices/700px.svg';
      }
      case EnumThemeDeviceIcon.MOBILE: {
        return '../../../../../assets/shared/devices/320px.svg';
      }
      case EnumThemeDeviceIcon.CUSTOM: {
        return '../../../../../assets/shared/devices/custom.svg';
      }
    }
  }
  childHanlder(e: Event): void {
    this.parentHandler.emit(e);
  }
}
