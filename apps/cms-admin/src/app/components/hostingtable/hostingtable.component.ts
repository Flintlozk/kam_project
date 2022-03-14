import { Component, Input, OnInit } from '@angular/core';
import { IHostingData } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'reactor-room-hostingtable',
  templateUrl: './hostingtable.component.html',
  styleUrls: ['./hostingtable.component.scss'],
})
export class HostingtableComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'status',
    'ownerID',
    'domainName',
    'domainExpireDate',
    'domainService',
    'systemExpireData',
    'usedHarddisk',
    'createDate',
    'package',
    'action',
  ];
  constructor() {}
  @Input() hostingData: IHostingData[];
  ngOnInit(): void {}
}
