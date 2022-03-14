import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cms-next-home-traffic-source',
  templateUrl: './home-traffic-source.component.html',
  styleUrls: ['./home-traffic-source.component.scss'],
})
export class HomeTrafficSourceComponent implements OnInit {
  labels = [
    this.translate.instant('Paid Search'),
    this.translate.instant('Organic Search'),
    this.translate.instant('Social'),
    this.translate.instant('Direct'),
    this.translate.instant('Referral'),
  ] as string[];
  colors = ['#5ECC4F', '#57585A', '#939FB8', '#ED9D3D', '#3E8A26'] as string[];
  data = [10, 40, 50, 80, 10] as number[];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}
}
