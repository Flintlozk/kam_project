import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EnumConfigGeneral } from '@reactor-room/cms-models-lib';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-next-setting-website-temp',
  templateUrl: './setting-website-temp.component.html',
  styleUrls: ['./setting-website-temp.component.scss'],
})
export class SettingWebsiteTempComponent implements OnInit, OnDestroy {
  @Input() parentGroup: FormGroup;
  @Output() parentGroupChange = new EventEmitter<any>();
  @Output() readyToPatch: EventEmitter<{ name: string }> = new EventEmitter<{ name: string }>();
  destroy$ = new Subject<void>();
  temp_close: FormControl;
  active = false;

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.temp_close = new FormControl(false);
    this.formCheck();
    this.parentGroupChange.emit(this.parentGroup);
  }
  formCheck(): void {
    const form = this.parentGroup.get('temporary_close') as FormControl;
    if (_.isEmpty(form)) {
      this.parentGroup.addControl('temporary_close', this.temp_close);
    } else {
      this.temp_close = form;
    }
    this.readyToPatch.emit({ name: EnumConfigGeneral.TEMPORARY_CLOSE });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
