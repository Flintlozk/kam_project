import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { ILeadsFormWithComponents, ILeadsFormWithComponentsSelected } from '@reactor-room/itopplus-model-lib';
import { Observable } from 'rxjs';

@Component({
  selector: 'reactor-room-form-sidebar',
  templateUrl: './form-sidebar.component.html',
  styleUrls: ['./form-sidebar.component.scss'],
})
export class FormSidebarComponent implements OnInit {
  formID = 1; // ! MOCK DATA
  form$: Observable<ILeadsFormWithComponents>;
  @Output() sidebarDataEvent = new EventEmitter<ILeadsFormWithComponentsSelected>();
  sidebarData: ILeadsFormWithComponentsSelected[] = [];

  constructor(private leadService: LeadsService) {}

  setActiveSidebarItem(index: number): void {
    this.sidebarData.forEach((item) => (item.selected = false));
    this.sidebarData[index].selected = true;
    this.sidebarDataEvent.emit(this.sidebarData[index]);
  }

  ngOnInit(): void {
    // GET DEFAULTS FORM
    this.leadService.getForms().subscribe((forms: ILeadsFormWithComponents[]) => {
      forms.map((item) => {
        this.sidebarData.push({
          ...item,
          selected: false,
        });
      });
      this.sidebarData[0].selected = true;
      this.sidebarDataEvent.emit(this.sidebarData[0]);
    });
  }
}
