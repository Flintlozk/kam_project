import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IProductCatalogList } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { TemplatesService } from '../templates.service';

@Component({
  selector: 'reactor-room-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss'],
})
export class ProductCatalogComponent implements OnInit {
  catalogList: IProductCatalogList[] = [
    {
      id: 0,
      title: this.translate.instant('All products'),
      images: [],
    },
  ];
  @Output() closeModal = new Subject<void>();
  constructor(private translate: TranslateService, public templateService: TemplatesService) {}

  ngOnInit(): void {}

  sendCatalogToChatBox({ id }: IProductCatalogList): void {
    this.templateService.changeMessage(id, 'product_catalog');
    this.closeModal.next(null);
  }
}
