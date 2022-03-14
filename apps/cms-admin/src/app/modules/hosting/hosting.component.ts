import { Component, OnInit } from '@angular/core';
import { IHostingData, StatusTypeEnum } from '@reactor-room/cms-models-lib';
import { IHeadervariable } from '../../type/headerType';

@Component({
  selector: 'reactor-room-hosting',
  templateUrl: './hosting.component.html',
  styleUrls: ['./hosting.component.scss'],
})
export class HostingComponent implements OnInit {
  name: IHeadervariable = {
    topicName: 'Hosting',
    buttonName: 'Hosting',
  };
  hostingData: IHostingData[] = [
    {
      position: 1,
      status: StatusTypeEnum.COMPLETE,
      ownerID: '609212b43c4fc89df82bc0ac5fc46b6ae9582165a064071c',
      domainName: 'cupfescreen.com',
      domainExpireDate: '08-05-2021',
      domainService: 'THNIC',
      systemExpireData: '08-05-2021',
      usedHarddisk: 30,
      createDate: '08-05-2021',
      package: ['more', 'itopplus'],
    },
    {
      position: 2,
      status: StatusTypeEnum.COMPLETE,
      ownerID: '609212b43c4fc89df82bc0ac5fc46b6ae9582165a064071c',
      domainName: 'cupfescreen.com',
      domainExpireDate: '08-05-2021',
      domainService: 'THNIC',
      systemExpireData: '08-05-2021',
      usedHarddisk: 30,
      createDate: '08-05-2021',
      package: ['more', 'itopplus'],
    },
    {
      position: 3,
      status: StatusTypeEnum.EXPIRED,
      ownerID: '609212b43c4fc89df82bc0ac5fc46b6ae9582165a064071c',
      domainName: 'cupfescreen.com',
      domainExpireDate: '08-05-2021',
      domainService: 'THNIC',
      systemExpireData: '08-05-2021',
      usedHarddisk: 30,
      createDate: '08-05-2021',
      package: ['more', 'itopplus'],
    },
    {
      position: 4,
      status: StatusTypeEnum.SUSPEND,
      ownerID: '609212b43c4fc89df82bc0ac5fc46b6ae9582165a064071c',
      domainName: 'cupfescreen.com',
      domainExpireDate: '08-05-2021',
      domainService: 'THNIC',
      systemExpireData: '08-05-2021',
      usedHarddisk: 30,
      createDate: '08-05-2021',
      package: ['more', 'itopplus'],
    },
    {
      position: 5,
      status: StatusTypeEnum.COMPLETE,
      ownerID: '609212b43c4fc89df82bc0ac5fc46b6ae9582165a064071c',
      domainName: 'cupfescreen.com',
      domainExpireDate: '08-05-2021',
      domainService: 'THNIC',
      systemExpireData: '08-05-2021',
      usedHarddisk: 30,
      createDate: '08-05-2021',
      package: ['more', 'itopplus'],
    },
    {
      position: 6,
      status: StatusTypeEnum.COMPLETE,
      ownerID: '609212b43c4fc89df82bc0ac5fc46b6ae9582165a064071c',
      domainName: 'cupfescreen.com',
      domainExpireDate: '08-05-2021',
      domainService: 'THNIC',
      systemExpireData: '08-05-2021',
      usedHarddisk: 30,
      createDate: '08-05-2021',
      package: ['more', 'itopplus'],
    },
    {
      position: 7,
      status: StatusTypeEnum.COMPLETE,
      ownerID: '609212b43c4fc89df82bc0ac5fc46b6ae9582165a064071c',
      domainName: 'cupfescreen.com',
      domainExpireDate: '08-05-2021',
      domainService: 'THNIC',
      systemExpireData: '08-05-2021',
      usedHarddisk: 30,
      createDate: '08-05-2021',
      package: ['more', 'itopplus'],
    },
    {
      position: 8,
      status: StatusTypeEnum.COMPLETE,
      ownerID: '609212b43c4fc89df82bc0ac5fc46b6ae9582165a064071c',
      domainName: 'cupfescreen.com',
      domainExpireDate: '08-05-2021',
      domainService: 'THNIC',
      systemExpireData: '08-05-2021',
      usedHarddisk: 30,
      createDate: '08-05-2021',
      package: ['more', 'itopplus'],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
