import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ILead, IPaginationPage } from '@reactor-room/crm-models-lib';

@Component({
  selector: 'reactor-room-lead-converted-table',
  templateUrl: './lead-converted-table.component.html',
  styleUrls: ['./lead-converted-table.component.scss'],
})
export class LeadConvertedTableComponent implements OnInit {
  displayedColumns: string[] = ['Select', 'Company', 'Main_Contact', 'Phone_no', 'E_mail', 'Importor', 'Opentask'];
  PaginationPage: IPaginationPage;
  constructor() {}
  @Input() inActiveData: MatTableDataSource<ILead>;
  ngOnInit(): void {}
}
