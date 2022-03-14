import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cms-next-home-total-visior',
  templateUrl: './home-total-visior.component.html',
  styleUrls: ['./home-total-visior.component.scss'],
})
export class HomeTotalVisiorComponent implements OnInit {
  labels = [this.translate.instant('New User'), this.translate.instant('Returning User')] as string[];
  colors = ['#5ECC4F', '#57585A'] as string[];
  data = [10, 40] as number[];
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
