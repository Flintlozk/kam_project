import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudienceHistoryService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience-history.service';
import { MessageService } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.service';
import { ChatboxView, IAudience, IAudienceWithCustomer, ILeadsFormWithComponentsSelected, IMessageModel } from '@reactor-room/itopplus-model-lib';
import { Observable } from 'rxjs';
import { FocusModeService } from '@reactor-room/plusmar-front-end-share/services/focusmode.service';

@Component({
  selector: 'reactor-room-leads-new-form',
  templateUrl: './leads-new-form.component.html',
  styleUrls: ['./leads-new-form.component.scss'],
})
export class LeadsNewFormComponent implements OnInit {
  available = true;
  form: ILeadsFormWithComponentsSelected;
  audience$: IAudienceWithCustomer;
  chatViewMode: ChatboxView = ChatboxView.ORDER;
  routeResolver$ = this.route.data;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mode: FocusModeService,
    private location: Location,
    private audienceHistoryService: AudienceHistoryService,
    private messageService: MessageService,
  ) {}

  getSidebarDataEvent(form: ILeadsFormWithComponentsSelected) {
    this.form = form;
  }

  ngOnInit(): void {
    this.routeResolver$.subscribe((resolved) => this.handleData(resolved));
    this.mode.setFocusMode(false);
  }

  handleData({ audience }: any): void {
    this.audience$ = audience;
  }

  back() {
    this.location.back();
  }

  selectForm() {
    if (this.audience$.id) {
      void this.router.navigate(['/leads/info', { ID: this.audience$.id, formID: this.form.id }]);
    }
  }
}
