import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { ILeadsFormWithComponents, ILeadsFormWithComponentsSelected } from '@reactor-room/itopplus-model-lib';
import { startCase } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'reactor-room-leads-new-form-sidebar',
  templateUrl: './leads-new-form-sidebar.component.html',
  styleUrls: ['./leads-new-form-sidebar.component.scss'],
})
export class LeadsNewFormSidebarComponent implements OnInit {
  formID = 1;
  form$: Observable<ILeadsFormWithComponents>;
  @Output() sidebarDataEvent = new EventEmitter<ILeadsFormWithComponentsSelected>();
  sidebarData: ILeadsFormWithComponentsSelected[] = [];

  constructor(private leadService: LeadsService) {
    this.leadService.getFormByID(this.formID).subscribe((form: ILeadsFormWithComponents) => {
      this.sidebarData.push({
        ...form,
        selected: true,
      });

      if (this.sidebarData.length === 1) {
        this.sidebarDataEvent.emit(this.sidebarData[0]);
      }
    });
  }

  setActiveSidebarItem(index) {
    this.sidebarDataEvent.emit(this.sidebarData[index]);
  }

  ngOnInit(): void {}

  getFormCount(): string {
    let forms = '';
    const length = this.sidebarData?.length;
    if (length === Number(1)) {
      forms = 'form';
    }

    if (length === Number(0) || length > Number(1)) {
      forms = 'forms';
    }

    return `${length} ${startCase(forms)}`;
  }
}
