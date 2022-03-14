import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cms-next-home-device',
  templateUrl: './home-device.component.html',
  styleUrls: ['./home-device.component.scss'],
})
export class HomeDeviceComponent implements OnInit {
  labels = [this.translate.instant('Desktop'), this.translate.instant('Smart Phone'), this.translate.instant('Tablet')] as string[];
  colors = ['#5ECC4F', '#57585A', '#939FB8'] as string[];
  data = [10, 40, 120] as number[];
  total: number;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.sumUpData();
  }

  sumUpData(): void {
    const add = (a: number, b: number) => a + b;
    this.total = this.data.reduce(add);
  }
}
